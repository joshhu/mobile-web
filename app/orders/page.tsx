import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import Header from "@/components/Header"
import OrderList from "@/components/OrderList"
import Link from "next/link"

interface Order {
  id: number
  order_number: string
  status: string
  total_amount: number
  payment_status: string
  created_at: string
  item_count: number
}

// 取得使用者的所有訂單
async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const orders = await sql`
      SELECT
        o.id,
        o.order_number,
        o.status,
        o.total_amount,
        o.payment_status,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ${userId}
      GROUP BY o.id, o.order_number, o.status, o.total_amount, o.payment_status, o.created_at
      ORDER BY o.created_at DESC
    `
    return orders as Order[]
  } catch (error) {
    console.error('Get user orders error:', error)
    return []
  }
}

export default async function OrdersPage() {
  const session = await auth()

  // 如果未登入，導向登入頁
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const orders = await getUserOrders(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">訂單管理</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">目前沒有任何訂單</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              開始購物
            </Link>
          </div>
        ) : (
          <OrderList orders={orders} />
        )}
      </main>
    </div>
  )
}
