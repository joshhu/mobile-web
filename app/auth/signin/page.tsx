import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import SignInForm from "@/components/SignInForm"
import Link from "next/link"

export default async function SignInPage() {
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
            登入您的帳號
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            還沒有帳號？{" "}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              立即註冊
            </Link>
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
