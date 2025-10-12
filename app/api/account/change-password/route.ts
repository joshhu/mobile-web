import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sql } from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcryptjs"

// 修改密碼驗證
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "請輸入目前密碼"),
  newPassword: z.string().min(6, "新密碼至少需要 6 個字元"),
  confirmPassword: z.string().min(1, "請確認新密碼"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "新密碼與確認密碼不符",
  path: ["confirmPassword"],
})

// POST - 修改密碼
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
    const validatedData = changePasswordSchema.parse(body)

    // 1. 取得使用者目前的密碼
    const users = await sql`
      SELECT password FROM users
      WHERE id = ${session.user.id}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: "找不到使用者" },
        { status: 404 }
      )
    }

    const user = users[0]

    // 2. 驗證目前密碼
    if (!user.password) {
      return NextResponse.json(
        { error: "此帳號無法修改密碼（可能使用第三方登入）" },
        { status: 400 }
      )
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "目前密碼不正確" },
        { status: 400 }
      )
    }

    // 3. 加密新密碼
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10)

    // 4. 更新密碼
    await sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE id = ${session.user.id}
    `

    return NextResponse.json({
      success: true,
      message: "密碼修改成功！"
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Change password error:", error)
    return NextResponse.json(
      { error: "修改密碼失敗，請稍後再試" },
      { status: 500 }
    )
  }
}
