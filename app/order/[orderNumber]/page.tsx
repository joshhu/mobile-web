import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { sql } from "@/lib/db"
import Header from "@/components/Header"
import Link from "next/link"
import PrintButton from "@/components/PrintButton"

interface OrderDetail {
  id: number
  order_number: string
  status: string
  total_amount: number
  payment_method: string
  payment_status: string
  recipient_name: string
  recipient_phone: string
  shipping_address: string
  created_at: string
  paid_at: string | null
}

interface OrderItem {
  id: number
  phone_id: number
  phone_name: string
  brand_name: string
  price: number
  quantity: number
  subtotal: number
}

// 取得訂單詳細資料
async function getOrderDetail(orderNumber: string, userId: string) {
  try {
    const orders = await sql`
      SELECT * FROM orders
      WHERE order_number = ${orderNumber}
      AND user_id = ${userId}
    `

    if (orders.length === 0) {
      return null
    }

    const order = orders[0] as OrderDetail

    const items = await sql`
      SELECT * FROM order_items
      WHERE order_id = ${order.id}
      ORDER BY id
    `

    return {
      order,
      items: items as OrderItem[],
    }
  } catch (error) {
    console.error('Get order detail error:', error)
    return null
  }
}

// 格式化日期時間
function formatDateTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 訂單狀態顯示
const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: '待處理', color: 'text-yellow-600 bg-yellow-50' },
  paid: { label: '已付款', color: 'text-green-600 bg-green-50' },
  processing: { label: '處理中', color: 'text-blue-600 bg-blue-50' },
  shipped: { label: '已出貨', color: 'text-purple-600 bg-purple-50' },
  delivered: { label: '已送達', color: 'text-green-600 bg-green-50' },
  cancelled: { label: '已取消', color: 'text-red-600 bg-red-50' },
}

// 付款方式顯示
const PAYMENT_METHOD: Record<string, string> = {
  credit_card: '信用卡',
  bank_transfer: '銀行轉帳',
  cash_on_delivery: '貨到付款',
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const session = await auth()

  // 如果未登入，導向登入頁
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const { orderNumber } = await params
  const orderData = await getOrderDetail(orderNumber, session.user.id)

  // 如果找不到訂單，顯示 404
  if (!orderData) {
    notFound()
  }

  const { order, items } = orderData
  const statusInfo = ORDER_STATUS[order.status] || ORDER_STATUS.pending

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 成功訊息 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-green-900">訂單建立成功！</h1>
              <p className="text-green-700 mt-1">感謝您的購買，我們將盡快為您處理訂單。</p>
            </div>
          </div>
        </div>

        {/* 訂單資訊 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">訂單資訊</h2>
              <p className="text-gray-600 mt-1">訂單編號：{order.order_number}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">訂單時間</h3>
              <p className="text-gray-900">{formatDateTime(order.created_at)}</p>
            </div>

            {order.paid_at && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">付款時間</h3>
                <p className="text-gray-900">{formatDateTime(order.paid_at)}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">付款方式</h3>
              <p className="text-gray-900">{PAYMENT_METHOD[order.payment_method]}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">付款狀態</h3>
              <p className="text-gray-900">
                {order.payment_status === 'paid' ? '✓ 已付款' : '待付款'}
              </p>
            </div>
          </div>
        </div>

        {/* 收件人資訊 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">收件人資訊</h2>
          <div className="space-y-3">
            <div className="flex">
              <span className="text-gray-600 w-24">收件人：</span>
              <span className="text-gray-900 font-medium">{order.recipient_name}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-24">聯絡電話：</span>
              <span className="text-gray-900 font-medium">{order.recipient_phone}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-24">配送地址：</span>
              <span className="text-gray-900 font-medium">{order.shipping_address}</span>
            </div>
          </div>
        </div>

        {/* 訂單商品 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">訂單商品</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                <div className="flex-1">
                  <Link
                    href={`/phone/${item.phone_id}`}
                    className="text-gray-900 font-medium hover:text-blue-600"
                  >
                    {item.brand_name} {item.phone_name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    NT$ {item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-semibold">
                    NT$ {item.subtotal.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 訂單總額 */}
          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>訂單總額</span>
              <span className="text-red-600">
                NT$ {order.total_amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            繼續購物
          </Link>
          <PrintButton />
        </div>
      </main>
    </div>
  )
}
