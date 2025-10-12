'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: number
  order_number: string
  status: string
  total_amount: number
  payment_status: string
  created_at: string
  item_count: number
}

interface OrderListProps {
  orders: Order[]
}

// 訂單狀態顯示
const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: '待處理', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: '已付款', color: 'bg-green-100 text-green-800' },
  processing: { label: '處理中', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: '已出貨', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: '已送達', color: 'bg-green-100 text-green-800' },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-800' },
}

// 格式化日期
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderList({ orders }: OrderListProps) {
  const router = useRouter()
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null)

  // 取消訂單
  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('確定要取消此訂單？')) return

    setCancellingOrderId(orderId)

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || '取消訂單失敗')
        setCancellingOrderId(null)
        return
      }

      alert(data.message || '訂單已取消')
      router.refresh() // 重新載入頁面
    } catch (error) {
      alert('發生錯誤，請稍後再試')
      setCancellingOrderId(null)
    }
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusInfo = ORDER_STATUS[order.status] || ORDER_STATUS.pending
        const canCancel = order.status !== 'cancelled' && order.status !== 'shipped' && order.status !== 'delivered'

        return (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            {/* 訂單標題 */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <Link
                  href={`/order/${order.order_number}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {order.order_number}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  訂單時間：{formatDate(order.created_at)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>

            {/* 訂單資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">商品數量</p>
                <p className="text-lg font-semibold text-gray-900">{order.item_count} 件</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">訂單金額</p>
                <p className="text-lg font-semibold text-red-600">
                  NT$ {order.total_amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">付款狀態</p>
                <p className="text-lg font-semibold text-gray-900">
                  {order.payment_status === 'paid' ? '✓ 已付款' : '待付款'}
                </p>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-3 pt-4 border-t">
              <Link
                href={`/order/${order.order_number}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                查看詳情
              </Link>
              <Link
                href={`/orders/${order.id}/tracking`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                查看物流
              </Link>
              {canCancel && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={cancellingOrderId === order.id}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  {cancellingOrderId === order.id ? '取消中...' : '取消訂單'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
