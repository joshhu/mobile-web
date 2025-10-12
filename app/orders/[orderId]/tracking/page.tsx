import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { sql } from "@/lib/db"
import Header from "@/components/Header"
import Link from "next/link"

interface OrderInfo {
  id: number
  order_number: string
  status: string
  recipient_name: string
  recipient_phone: string
  shipping_address: string
  created_at: string
  paid_at: string | null
  shipped_at: string | null
  delivered_at: string | null
}

// 取得訂單資訊
async function getOrderInfo(orderId: string, userId: string) {
  try {
    const orders = await sql`
      SELECT
        id,
        order_number,
        status,
        recipient_name,
        recipient_phone,
        shipping_address,
        created_at,
        paid_at,
        shipped_at,
        delivered_at
      FROM orders
      WHERE id = ${orderId}
      AND user_id = ${userId}
    `

    if (orders.length === 0) {
      return null
    }

    return orders[0] as OrderInfo
  } catch (error) {
    console.error('Get order info error:', error)
    return null
  }
}

// 格式化日期時間
function formatDateTime(dateString: string | null) {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 物流狀態時間軸
interface TrackingEvent {
  status: string
  label: string
  time: string | null
  completed: boolean
}

function getTrackingEvents(order: OrderInfo): TrackingEvent[] {
  const events: TrackingEvent[] = [
    {
      status: 'ordered',
      label: '訂單成立',
      time: formatDateTime(order.created_at),
      completed: true,
    },
    {
      status: 'paid',
      label: '付款完成',
      time: formatDateTime(order.paid_at),
      completed: !!order.paid_at,
    },
    {
      status: 'processing',
      label: '訂單處理中',
      time: null,
      completed: ['processing', 'shipped', 'delivered'].includes(order.status),
    },
    {
      status: 'shipped',
      label: '商品已出貨',
      time: formatDateTime(order.shipped_at),
      completed: !!order.shipped_at,
    },
    {
      status: 'delivered',
      label: '商品已送達',
      time: formatDateTime(order.delivered_at),
      completed: !!order.delivered_at,
    },
  ]

  return events
}

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const session = await auth()

  // 如果未登入，導向登入頁
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const { orderId } = await params
  const order = await getOrderInfo(orderId, session.user.id)

  // 如果找不到訂單，顯示 404
  if (!order) {
    notFound()
  }

  const trackingEvents = getTrackingEvents(order)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/orders"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回訂單管理
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">物流追蹤</h1>
        <p className="text-gray-600 mb-8">訂單編號：{order.order_number}</p>

        {/* 訂單已取消提示 */}
        {order.status === 'cancelled' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">此訂單已取消</p>
          </div>
        )}

        {/* 配送資訊 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">配送資訊</h2>
          <div className="space-y-2">
            <div className="flex">
              <span className="text-gray-600 w-28">收件人：</span>
              <span className="text-gray-900 font-medium">{order.recipient_name}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-28">聯絡電話：</span>
              <span className="text-gray-900 font-medium">{order.recipient_phone}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-28">配送地址：</span>
              <span className="text-gray-900 font-medium">{order.shipping_address}</span>
            </div>
          </div>
        </div>

        {/* 物流時間軸 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">物流狀態</h2>

          <div className="relative">
            {trackingEvents.map((event, index) => (
              <div key={event.status} className="flex gap-4 pb-8 last:pb-0">
                {/* 時間軸圓點與線 */}
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    event.completed
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white border-gray-300'
                  }`} />
                  {index < trackingEvents.length - 1 && (
                    <div className={`w-0.5 h-full mt-1 ${
                      event.completed ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>

                {/* 事件內容 */}
                <div className="flex-1 -mt-1">
                  <p className={`font-medium ${
                    event.completed ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {event.label}
                  </p>
                  {event.time && (
                    <p className="text-sm text-gray-500 mt-1">{event.time}</p>
                  )}
                  {!event.completed && event.status !== 'delivered' && index > 0 && (
                    <p className="text-sm text-gray-400 mt-1">待處理</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 備註 */}
          {order.status !== 'cancelled' && !order.delivered_at && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500">
                💡 物流資訊會即時更新，請耐心等候
              </p>
            </div>
          )}
        </div>

        {/* 操作按鈕 */}
        <div className="mt-6">
          <Link
            href={`/order/${order.order_number}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            查看訂單詳情
          </Link>
        </div>
      </main>
    </div>
  )
}
