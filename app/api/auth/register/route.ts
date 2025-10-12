import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, { message: "名稱至少 2 個字元" }),
  email: z.string().email({ message: "請輸入有效的 Email" }),
  password: z.string().min(6, { message: "密碼至少 6 個字元" }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    // 檢查 email 是否已存在
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "此 Email 已被註冊" },
        { status: 400 }
      )
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10)

    // 建立使用者
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email, created_at
    `

    return NextResponse.json({
      user: result[0],
      message: "註冊成功！請登入"
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "註冊失敗，請稍後再試" },
      { status: 500 }
    )
  }
}
