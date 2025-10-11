import Link from 'next/link';
import { sql } from '@/lib/db';
import Header from '@/components/Header';

// 手機介面
interface Phone {
  id: number;
  model_name: string;
  brand_name: string;
  our_price: number | null;
  official_price: number | null;
  image_url: string | null;
  popularity_score: number;
}

// 每頁顯示數量
const PHONES_PER_PAGE = 40;

// 取得所有手機（分頁）
async function getAllPhones(page: number = 1): Promise<{ phones: Phone[]; total: number }> {
  try {
    const offset = (page - 1) * PHONES_PER_PAGE;

    const phones = await sql`
      SELECT
        p.id,
        p.model_name,
        b.name as brand_name,
        p.our_price,
        p.official_price,
        p.image_url,
        p.popularity_score
      FROM phones p
      JOIN brands b ON p.brand_id = b.id
      ORDER BY p.popularity_score DESC
      LIMIT ${PHONES_PER_PAGE}
      OFFSET ${offset}
    `;

    const totalResult = await sql`SELECT COUNT(*) as count FROM phones`;
    const total = Number(totalResult[0].count);

    return { phones: phones as Phone[], total };
  } catch (error) {
    console.error('取得手機失敗:', error);
    return { phones: [], total: 0 };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { phones, total } = await getAllPhones(currentPage);
  const totalPages = Math.ceil(total / PHONES_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            所有手機 ({total} 支)
          </h1>
          <div className="text-sm text-gray-500">
            第 {currentPage} / {totalPages} 頁
          </div>
        </div>

        {phones.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">目前尚無手機資料</p>
            <p className="text-sm text-gray-400 mt-2">
              請確認資料庫連線設定是否正確，並執行 schema.sql 建立資料表
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {phones.map((phone, index) => (
                <Link
                  key={phone.id}
                  href={`/phone/${phone.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative">
                    {/* 排名標籤 */}
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold z-10">
                      #{(currentPage - 1) * PHONES_PER_PAGE + index + 1}
                    </div>

                    {/* 手機圖片 */}
                    {phone.image_url ? (
                      <img
                        src={phone.image_url}
                        alt={phone.model_name}
                        className="w-full h-48 object-contain bg-white"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">無圖片</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {phone.brand_name} {phone.model_name}
                    </h3>

                    <div className="space-y-1">
                      {phone.official_price && (
                        <p className="text-sm text-gray-500 line-through">
                          官方價 NT$ {phone.official_price.toLocaleString()}
                        </p>
                      )}
                      {phone.our_price && (
                        <p className="text-lg font-bold text-red-600">
                          NT$ {phone.our_price.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-gray-400">
                      熱門度: {phone.popularity_score}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 分頁控制 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/?page=${currentPage - 1}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    上一頁
                  </Link>
                )}

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Link
                        key={pageNum}
                        href={`/?page=${pageNum}`}
                        className={`px-3 py-2 rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                  {totalPages > 10 && (
                    <>
                      {currentPage < totalPages - 5 && <span className="px-2">...</span>}
                      {currentPage > 5 && currentPage < totalPages - 2 && (
                        <Link
                          href={`/?page=${totalPages}`}
                          className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          {totalPages}
                        </Link>
                      )}
                    </>
                  )}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/?page=${currentPage + 1}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    下一頁
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
