import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Header from "@/components/Header"
import CartItems from "@/components/CartItems"
import Link from "next/link"

export default async function CartPage() {
  const session = await auth()

  // 如果未登入，導向登入頁
  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">購物車</h1>
          <p className="text-gray-600 mt-2">
            <Link href="/" className="text-blue-600 hover:underline">
              繼續購物
            </Link>
          </p>
        </div>

        <CartItems />
      </main>
    </div>
  )
}
