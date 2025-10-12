import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/db"
import { z } from "zod"

// PATCH - 更新購物車項目數量
const updateQuantitySchema = z.object({
  quantity: z.number().min(1).max(99),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const { itemId } = await params
    const body = await request.json()
    const { quantity } = updateQuantitySchema.parse(body)

    // 更新數量（確認是使用者自己的購物車項目）
    const result = await sql`
      UPDATE cart_items
      SET quantity = ${quantity}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(itemId)} AND user_id = ${session.user.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "購物車項目不存在" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "數量已更新",
      quantity
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Update cart item error:", error)
    return NextResponse.json(
      { error: "更新失敗" },
      { status: 500 }
    )
  }
}

// DELETE - 刪除購物車項目
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const { itemId } = await params

    // 刪除項目（確認是使用者自己的購物車項目）
    const result = await sql`
      DELETE FROM cart_items
      WHERE id = ${parseInt(itemId)} AND user_id = ${session.user.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "購物車項目不存在" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "已從購物車移除"
    })
  } catch (error) {
    console.error("Delete cart item error:", error)
    return NextResponse.json(
      { error: "刪除失敗" },
      { status: 500 }
    )
  }
}
