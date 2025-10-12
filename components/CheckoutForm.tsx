'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Dummy 測試資料
const DUMMY_DATA = {
  recipientName: '王小明',
  recipientPhone: '0912345678',
  shippingAddress: '台北市信義區信義路五段7號',
  creditCardNumber: '4111-1111-1111-1111',
  expiryDate: '12/25',
  cvv: '123',
};

export default function CheckoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 表單資料
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    shippingAddress: '',
    paymentMethod: 'credit_card',
    creditCardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // 填入測試資料
  const fillDummyData = () => {
    setFormData({
      ...formData,
      ...DUMMY_DATA,
      paymentMethod: 'credit_card',
    });
  };

  // 處理表單送出
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientName: formData.recipientName,
          recipientPhone: formData.recipientPhone,
          shippingAddress: formData.shippingAddress,
          paymentMethod: formData.paymentMethod,
          creditCardNumber: formData.creditCardNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '結帳失敗');
        setLoading(false);
        return;
      }

      // 結帳成功，導向訂單確認頁
      router.push(`/order/${data.order.orderNumber}`);
    } catch (err) {
      setError('發生錯誤，請稍後再試');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* 測試資料按鈕 */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-sm text-blue-800 mb-2">
          💡 測試模式：點擊下方按鈕自動填入測試資料
        </p>
        <button
          type="button"
          onClick={fillDummyData}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          填入測試資料
        </button>
      </div>

      {/* 收件人資訊 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">收件人資訊</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              收件人姓名 *
            </label>
            <input
              type="text"
              required
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入收件人姓名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              收件人電話 *
            </label>
            <input
              type="tel"
              required
              value={formData.recipientPhone}
              onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入收件人電話"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              配送地址 *
            </label>
            <textarea
              required
              rows={3}
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入配送地址"
            />
          </div>
        </div>
      </div>

      {/* 付款方式 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">付款方式</h2>
        <div className="space-y-3">
          <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={formData.paymentMethod === 'credit_card'}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="mr-3"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">信用卡</p>
              <p className="text-sm text-gray-500">支援 Visa、Mastercard、JCB</p>
            </div>
          </label>
        </div>

        {/* 信用卡資訊 */}
        {formData.paymentMethod === 'credit_card' && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                信用卡號 *
              </label>
              <input
                type="text"
                required
                value={formData.creditCardNumber}
                onChange={(e) => setFormData({ ...formData, creditCardNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1234-5678-9012-3456"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  有效期限 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  安全碼 (CVV) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              🔒 您的付款資訊經過加密保護
            </p>
          </div>
        )}
      </div>

      {/* 送出按鈕 */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '處理中...' : '確認訂單並付款'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          點擊「確認訂單並付款」即表示您同意我們的服務條款
        </p>
      </div>
    </form>
  );
}
