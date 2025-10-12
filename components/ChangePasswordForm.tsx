'use client';

import { useState } from 'react';

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || '修改失敗' });
        setLoading(false);
        return;
      }

      setMessage({ type: 'success', text: data.message || '密碼修改成功！' });

      // 清空表單
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setLoading(false);

      // 3秒後清除成功訊息
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: '發生錯誤，請稍後再試' });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* 目前密碼 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          目前密碼 *
        </label>
        <input
          type="password"
          required
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="請輸入目前密碼"
        />
      </div>

      {/* 新密碼 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          新密碼 *
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="至少 6 個字元"
        />
      </div>

      {/* 確認新密碼 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          確認新密碼 *
        </label>
        <input
          type="password"
          required
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="再次輸入新密碼"
        />
      </div>

      {/* 送出按鈕 */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '處理中...' : '修改密碼'}
      </button>
    </form>
  );
}
