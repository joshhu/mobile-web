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

// 取得本月最紅手機前 20 名
async function getPopularPhones(): Promise<Phone[]> {
  try {
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
      LIMIT 20
    `;
    return phones as Phone[];
  } catch (error) {
    console.error('取得熱門手機失敗:', error);
    return [];
  }
}

export default async function Home() {
  const popularPhones = await getPopularPhones();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          本月最紅手機 Top 20
        </h1>

        {popularPhones.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">目前尚無手機資料</p>
            <p className="text-sm text-gray-400 mt-2">
              請確認資料庫連線設定是否正確，並執行 schema.sql 建立資料表
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPhones.map((phone, index) => (
              <Link
                key={phone.id}
                href={`/phone/${phone.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative">
                  {/* 排名標籤 */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    #{index + 1}
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
        )}
      </main>
    </div>
  );
}
