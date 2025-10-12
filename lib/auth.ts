import NextAuth from "next-auth"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

// 登入表單驗證 schema
const signInSchema = z.object({
  email: z.string().email({ message: "請輸入有效的 Email" }),
  password: z.string().min(6, { message: "密碼至少 6 個字元" }),
})

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })

  return {
    adapter: NeonAdapter(pool),
    session: { strategy: "jwt" },  // 使用 JWT（更適合 serverless）
    pages: {
      signIn: "/auth/signin",  // 自訂登入頁面
    },
    providers: [
      Credentials({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "密碼", type: "password" },
        },
        async authorize(credentials) {
          try {
            const { email, password } = await signInSchema.parseAsync(credentials)

            // 查詢使用者
            const result = await pool.query(
              'SELECT * FROM users WHERE email = $1',
              [email]
            )

            const user = result.rows[0]

            if (!user || !user.password) {
              return null
            }

            // 驗證密碼
            const isValid = await bcrypt.compare(password, user.password)

            if (!isValid) {
              return null
            }

            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              image: user.image,
            }
          } catch (error) {
            console.error("Authorization error:", error)
            return null
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id
        }
        return token
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string
        }
        return session
      },
    },
  }
})
