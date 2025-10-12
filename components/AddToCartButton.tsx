"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface AddToCartButtonProps {
  phoneId: number
  isLoggedIn: boolean
}

export default function AddToCartButton({ phoneId, isLoggedIn }: AddToCartButtonProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneId,
          quantity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || '加入購物車失敗' })
        setLoading(false)
        return
      }

      setMessage({ type: 'success', text: data.message || '已加入購物車！' })
      setLoading(false)

      // 重新整理頁面以更新購物車數量
      router.refresh()

      // 3秒後清除訊息
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: '發生錯誤，請稍後再試' })
      setLoading(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < 99) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* 訊息提示 */}
      {message && (
        <div className={`p-3 rounded-md ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* 數量選擇 */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">數量：</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="px-3 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              if (val >= 1 && val <= 99) {
                setQuantity(val)
              }
            }}
            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
          />
          <button
            type="button"
            onClick={incrementQuantity}
            disabled={quantity >= 99}
            className="px-3 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* 加入購物車按鈕 */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        {loading ? '加入中...' : isLoggedIn ? '加入購物車' : '登入後購買'}
      </button>
    </div>
  )
}
