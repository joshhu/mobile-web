import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/db"
import { z } from "zod"

// 結帳資料驗證
const checkoutSchema = z.object({
  recipientName: z.string().min(1, "請輸入收件人姓名"),
  recipientPhone: z.string().min(1, "請輸入收件人電話"),
  shippingAddress: z.string().min(1, "請輸入配送地址"),
  paymentMethod: z.string().min(1, "請選擇付款方式"),
  creditCardNumber: z.string().optional(), // Dummy 信用卡號
})

// 生成訂單編號
function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD-${year}${month}${day}-${random}`
}

// POST - 建立訂單並結帳
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)

    // 1. 取得使用者的購物車內容
    const cartItems = await sql`
      SELECT
        ci.id,
        ci.quantity,
        p.id as phone_id,
        p.model_name as phone_name,
        b.name as brand_name,
        COALESCE(p.our_price, p.official_price, 0) as price
      FROM cart_items ci
      JOIN phones p ON ci.phone_id = p.id
      JOIN brands b ON p.brand_id = b.id
      WHERE ci.user_id = ${session.user.id}
    `

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "購物車是空的" },
        { status: 400 }
      )
    }

    // 2. 計算訂單總額
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // 3. 生成訂單編號
    const orderNumber = generateOrderNumber()

    // 4. 建立訂單（使用 transaction）
    // 插入訂單主檔
    const orderResult = await sql`
      INSERT INTO orders (
        user_id,
        order_number,
        status,
        total_amount,
        payment_method,
        payment_status,
        recipient_name,
        recipient_phone,
        shipping_address,
        paid_at
      )
      VALUES (
        ${session.user.id},
        ${orderNumber},
        'paid',
        ${totalAmount},
        ${validatedData.paymentMethod},
        'paid',
        ${validatedData.recipientName},
        ${validatedData.recipientPhone},
        ${validatedData.shippingAddress},
        CURRENT_TIMESTAMP
      )
      RETURNING id, order_number
    `

    const orderId = orderResult[0].id

    // 5. 插入訂單明細
    for (const item of cartItems) {
      await sql`
        INSERT INTO order_items (
          order_id,
          phone_id,
          phone_name,
          brand_name,
          price,
          quantity,
          subtotal
        )
        VALUES (
          ${orderId},
          ${item.phone_id},
          ${item.phone_name},
          ${item.brand_name},
          ${item.price},
          ${item.quantity},
          ${item.price * item.quantity}
        )
      `
    }

    // 6. 清空購物車
    await sql`
      DELETE FROM cart_items
      WHERE user_id = ${session.user.id}
    `

    return NextResponse.json({
      success: true,
      message: "訂單建立成功！",
      order: {
        id: orderId,
        orderNumber: orderResult[0].order_number,
        totalAmount,
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "結帳失敗，請稍後再試" },
      { status: 500 }
    )
  }
}
