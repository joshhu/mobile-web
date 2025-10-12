'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
    >
      列印訂單
    </button>
  );
}
