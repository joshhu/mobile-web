import Link from 'next/link';
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';

// 手機介面
interface Phone {
  id: number;
  model_name: string;
  our_price: number | null;
  official_price: number | null;
  image_url: string | null;
  display_size: number | null;
  ram: number | null;
  storage: string | null;
  main_camera: string | null;
}

// 取得品牌的所有手機
async function getPhonesByBrand(brandName: string): Promise<Phone[]> {
  try {
    const phones = await sql`
      SELECT
        p.id,
        p.model_name,
        p.our_price,
        p.official_price,
        p.image_url,
        p.display_size,
        p.ram,
        p.storage,
        p.main_camera
      FROM phones p
      JOIN brands b ON p.brand_id = b.id
      WHERE b.name = ${brandName}
      ORDER BY p.release_date DESC NULLS LAST, p.created_at DESC
    `;
    return phones as Phone[];
  } catch (error) {
    console.error('取得品牌手機失敗:', error);
    return [];
  }
}

// 檢查品牌是否存在
async function brandExists(brandName: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM brands
      WHERE name = ${brandName}
    `;
    return result[0].count > 0;
  } catch (error) {
    console.error('檢查品牌失敗:', error);
    return false;
  }
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brandName: string }>;
}) {
  const { brandName } = await params;
  const decodedBrandName = decodeURIComponent(brandName);

  // 檢查品牌是否存在
  const exists = await brandExists(decodedBrandName);
  if (!exists) {
    notFound();
  }

  const phones = await getPhonesByBrand(decodedBrandName);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 導航列 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← 返回首頁
          </Link>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {decodedBrandName} 手機列表
        </h1>

        {phones.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">此品牌目前沒有手機資料</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phones.map((phone) => (
              <Link
                key={phone.id}
                href={`/phone/${phone.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* 手機圖片 */}
                {phone.image_url ? (
                  <img
                    src={phone.image_url}
                    alt={phone.model_name}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">無圖片</span>
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">
                    {phone.model_name}
                  </h3>

                  {/* 重點規格 */}
                  <div className="space-y-1 mb-4 text-sm text-gray-600">
                    {phone.display_size && (
                      <p>螢幕：{phone.display_size} 吋</p>
                    )}
                    {phone.ram && phone.storage && (
                      <p>
                        記憶體：{phone.ram}GB / {phone.storage}
                      </p>
                    )}
                    {phone.main_camera && (
                      <p className="truncate">相機：{phone.main_camera}</p>
                    )}
                  </div>

                  {/* 價格資訊 */}
                  <div className="border-t pt-3">
                    {phone.official_price && (
                      <p className="text-sm text-gray-500 line-through">
                        官方價 NT$ {phone.official_price.toLocaleString()}
                      </p>
                    )}
                    {phone.our_price ? (
                      <p className="text-xl font-bold text-red-600">
                        NT$ {phone.our_price.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">價格未定</p>
                    )}
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

// 產生靜態參數（可選，用於靜態生成）
export async function generateStaticParams() {
  try {
    const brands = await sql`SELECT name FROM brands`;
    return brands.map((brand: { name: string }) => ({
      brandName: brand.name,
    }));
  } catch (error) {
    console.error('產生靜態參數失敗:', error);
    return [];
  }
}
