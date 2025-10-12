import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/db"

// PATCH - 取消訂單
export async function PATCH(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const { orderId } = await context.params

    // 1. 檢查訂單是否存在且屬於該使用者
    const orders = await sql`
      SELECT id, status, user_id
      FROM orders
      WHERE id = ${orderId}
    `

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "找不到訂單" },
        { status: 404 }
      )
    }

    const order = orders[0]

    // 2. 驗證訂單擁有者
    if (order.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "無權操作此訂單" },
        { status: 403 }
      )
    }

    // 3. 檢查訂單狀態（已取消、已出貨、已送達的訂單不能取消）
    if (order.status === 'cancelled') {
      return NextResponse.json(
        { error: "訂單已取消" },
        { status: 400 }
      )
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return NextResponse.json(
        { error: "訂單已出貨，無法取消" },
        { status: 400 }
      )
    }

    // 4. 更新訂單狀態為已取消
    await sql`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ${orderId}
    `

    return NextResponse.json({
      success: true,
      message: "訂單已取消"
    })

  } catch (error) {
    console.error("Cancel order error:", error)
    return NextResponse.json(
      { error: "取消訂單失敗，請稍後再試" },
      { status: 500 }
    )
  }
}
