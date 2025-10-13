import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import Header from "@/components/Header"
import CheckoutForm from "@/components/CheckoutForm"

// 取得購物車摘要
async function getCartSummary(userId: string) {
  try {
    const cartItems = await sql`
      SELECT
        ci.id,
        ci.quantity,
        p.id as phone_id,
        p.model_name as phone_name,
        b.name as brand_name,
        COALESCE(p.our_price, p.official_price, 0) as price,
        p.image_url
      FROM cart_items ci
      JOIN phones p ON ci.phone_id = p.id
      JOIN brands b ON p.brand_id = b.id
      WHERE ci.user_id = ${userId}
      ORDER BY ci.created_at DESC
    `

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = cartItems.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      phone_id: item.phone_id,
      phone_name: item.phone_name,
      brand_name: item.brand_name,
      price: item.price,
      image_url: item.image_url,
      subtotal: Number(item.price) * Number(item.quantity)
    }))

    const totalItems = items.reduce((sum, item) => sum + Number(item.quantity), 0)
    const totalAmount = items.reduce((sum, item) => sum + Number(item.subtotal), 0)

    return {
      items,
      totalItems,
      totalAmount,
    }
  } catch (error) {
    console.error('Get cart summary error:', error)
    return { items: [], totalItems: 0, totalAmount: 0 }
  }
}

export default async function CheckoutPage() {
  const session = await auth()

  // 如果未登入，導向登入頁
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // 取得購物車資料
  const cart = await getCartSummary(session.user.id)

  // 如果購物車是空的，導向購物車頁
  if (cart.items.length === 0) {
    redirect("/cart")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">結帳</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：結帳表單 */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          {/* 右側：訂單摘要 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">訂單摘要</h2>

              {/* 商品列表 */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={`${item.brand_name} ${item.phone_name}`}
                        className="w-16 h-16 object-contain rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">無圖</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.brand_name} {item.phone_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        NT$ {item.price.toLocaleString()} × {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        NT$ {item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 總計 */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>商品數量</span>
                  <span>{cart.totalItems} 件</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>訂單總額</span>
                  <span className="text-red-600">
                    NT$ {cart.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
