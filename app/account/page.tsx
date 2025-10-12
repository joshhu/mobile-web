import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Header from "@/components/Header"
import ChangePasswordForm from "@/components/ChangePasswordForm"

export default async function AccountPage() {
  const session = await auth()

  // 如果未登入，導向登入頁
  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">帳戶管理</h1>

        {/* 帳戶資訊 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">帳戶資訊</h2>
          <div className="space-y-3">
            <div className="flex">
              <span className="text-gray-600 w-24">姓名：</span>
              <span className="text-gray-900 font-medium">
                {session.user.name || '未設定'}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-24">Email：</span>
              <span className="text-gray-900 font-medium">
                {session.user.email}
              </span>
            </div>
          </div>
        </div>

        {/* 修改密碼 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">修改密碼</h2>
          <ChangePasswordForm />
        </div>
      </main>
    </div>
  )
}
