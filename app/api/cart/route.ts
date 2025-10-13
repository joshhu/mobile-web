import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/db"
import { z } from "zod"

// GET - 取得使用者的購物車
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    // 查詢購物車項目（包含手機資訊）
    const cartItems = await sql`
      SELECT
        ci.id,
        ci.quantity,
        ci.created_at,
        p.id as phone_id,
        p.model_name as phone_name,
        COALESCE(p.our_price, p.official_price, 0) as price,
        p.image_url,
        b.name as brand_name
      FROM cart_items ci
      JOIN phones p ON ci.phone_id = p.id
      JOIN brands b ON p.brand_id = b.id
      WHERE ci.user_id = ${session.user.id}
      ORDER BY ci.created_at DESC
    `

    // 格式化資料並計算小計
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = cartItems.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      created_at: item.created_at,
      phone_id: item.phone_id,
      phone_name: item.phone_name,
      price: item.price,
      image_url: item.image_url,
      brand_name: item.brand_name,
      item_total: Number(item.price) * Number(item.quantity)
    }))

    // 計算總數量和總金額
    const totalItems = items.reduce((sum, item) => sum + Number(item.quantity), 0)
    const totalAmount = items.reduce((sum, item) => sum + Number(item.item_total), 0)

    return NextResponse.json({
      items,
      summary: {
        total_items: totalItems,
        total_amount: totalAmount,
      }
    })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json(
      { error: "取得購物車失敗" },
      { status: 500 }
    )
  }
}

// POST - 新增或更新購物車項目
const addToCartSchema = z.object({
  phoneId: z.number(),
  quantity: z.number().min(1).max(99),
})

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
    const { phoneId, quantity } = addToCartSchema.parse(body)

    // 檢查手機是否存在
    const phone = await sql`
      SELECT id FROM phones WHERE id = ${phoneId}
    `

    if (phone.length === 0) {
      return NextResponse.json(
        { error: "手機不存在" },
        { status: 404 }
      )
    }

    // 檢查是否已在購物車中
    const existing = await sql`
      SELECT id, quantity FROM cart_items
      WHERE user_id = ${session.user.id} AND phone_id = ${phoneId}
    `

    if (existing.length > 0) {
      // 更新數量
      const newQuantity = existing[0].quantity + quantity
      await sql`
        UPDATE cart_items
        SET quantity = ${newQuantity}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `
      return NextResponse.json({
        message: "已更新購物車數量",
        quantity: newQuantity
      })
    } else {
      // 新增項目
      await sql`
        INSERT INTO cart_items (user_id, phone_id, quantity)
        VALUES (${session.user.id}, ${phoneId}, ${quantity})
      `
      return NextResponse.json({
        message: "已加入購物車"
      }, { status: 201 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "驗證失敗" },
        { status: 400 }
      )
    }

    console.error("Add to cart error:", error)
    return NextResponse.json(
      { error: "加入購物車失敗" },
      { status: 500 }
    )
  }
}

// DELETE - 清空購物車
export async function DELETE() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    await sql`
      DELETE FROM cart_items
      WHERE user_id = ${session.user.id}
    `

    return NextResponse.json({
      message: "購物車已清空"
    })
  } catch (error) {
    console.error("Clear cart error:", error)
    return NextResponse.json(
      { error: "清空購物車失敗" },
      { status: 500 }
    )
  }
}
