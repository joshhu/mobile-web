'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
  id: number;
  phone_id: number;
  quantity: number;
  phone_name: string;
  brand_name: string;
  price: number;
  image_url: string | null;
  item_total: number;
}

interface CartData {
  items: CartItem[];
  summary: {
    total_items: number;
    total_amount: number;
  };
}

export default function CartItems() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  // 載入購物車資料
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('無法載入購物車');
      const data = await res.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 更新數量
  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) throw new Error('更新失敗');
      await fetchCart();
      router.refresh(); // 更新 Header 的購物車數量
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失敗');
    } finally {
      setUpdating(null);
    }
  };

  // 刪除項目
  const deleteItem = async (itemId: number) => {
    if (!confirm('確定要移除此項目？')) return;
    setUpdating(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('刪除失敗');
      await fetchCart();
      router.refresh(); // 更新 Header 的購物車數量
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除失敗');
    } finally {
      setUpdating(null);
    }
  };

  // 清空購物車
  const clearCart = async () => {
    if (!confirm('確定要清空購物車？')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('清空失敗');
      await fetchCart();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '清空失敗');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 text-lg mb-4">購物車是空的</p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          開始購物
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 購物車項目 */}
      <div className="bg-white rounded-lg shadow">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50"
          >
            {/* 手機圖片 */}
            <Link href={`/phone/${item.phone_id}`} className="flex-shrink-0">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={`${item.brand_name} ${item.phone_name}`}
                  className="w-24 h-24 object-contain rounded"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">無圖片</span>
                </div>
              )}
            </Link>

            {/* 手機資訊 */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/phone/${item.phone_id}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600"
              >
                {item.brand_name} {item.phone_name}
              </Link>
              <p className="text-xl font-bold text-red-600 mt-1">
                NT$ {item.price.toLocaleString()}
              </p>
            </div>

            {/* 數量控制 */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={updating === item.id || item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > 0) updateQuantity(item.id, val);
                  }}
                  disabled={updating === item.id}
                  className="w-16 text-center border border-gray-300 rounded py-1"
                  min="1"
                />
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={updating === item.id}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>

              {/* 小計 */}
              <p className="text-sm text-gray-600">
                小計：NT$ {item.item_total.toLocaleString()}
              </p>

              {/* 刪除按鈕 */}
              <button
                onClick={() => deleteItem(item.id)}
                disabled={updating === item.id}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 購物車摘要 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-600">
              共 <span className="font-semibold">{cart.summary.total_items}</span> 件商品
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              總計：NT$ {cart.summary.total_amount.toLocaleString()}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            清空購物車
          </button>
        </div>

        <Link
          href="/checkout"
          className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
        >
          前往結帳
        </Link>
      </div>
    </div>
  );
}
