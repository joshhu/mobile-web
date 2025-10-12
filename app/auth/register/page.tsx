import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import SignUpForm from "@/components/SignUpForm"
import Link from "next/link"

export default async function RegisterPage() {
  const session = await auth()

  // 如果已登入，導向首頁
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            建立新帳號
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            已經有帳號了？{" "}
            <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
              立即登入
            </Link>
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}
