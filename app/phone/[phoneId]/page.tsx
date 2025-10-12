import Link from 'next/link';
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import AddToCartButton from '@/components/AddToCartButton';
import { auth } from '@/lib/auth';

// 手機完整資料介面
interface PhoneDetail {
  id: number;
  brand_name: string;
  model_name: string;
  release_date: string | null;
  official_price: number | null;
  our_price: number | null;
  display_size: number | null;
  resolution: string | null;
  weight: number | null;
  cpu: string | null;
  ram: number | null;
  storage: string | null;
  main_camera: string | null;
  front_camera: string | null;
  battery: number | null;
  os: string | null;
  image_url: string | null;
}

// 評測連結介面
interface Review {
  id: number;
  platform: string;
  title: string | null;
  url: string;
  published_at: string | null;
}

// 取得手機詳細資料
async function getPhoneDetail(phoneId: string): Promise<PhoneDetail | null> {
  try {
    const result = await sql`
      SELECT
        p.id,
        b.name as brand_name,
        p.model_name,
        p.release_date,
        p.official_price,
        p.our_price,
        p.display_size,
        p.resolution,
        p.weight,
        p.cpu,
        p.ram,
        p.storage,
        p.main_camera,
        p.front_camera,
        p.battery,
        p.os,
        p.image_url
      FROM phones p
      JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ${phoneId}
    `;

    if (result.length === 0) return null;
    return result[0] as PhoneDetail;
  } catch (error) {
    console.error('取得手機詳細資料失敗:', error);
    return null;
  }
}

// 取得評測連結
async function getReviews(phoneId: string): Promise<Review[]> {
  try {
    const reviews = await sql`
      SELECT id, platform, title, url, published_at
      FROM reviews
      WHERE phone_id = ${phoneId}
      ORDER BY published_at DESC NULLS LAST
    `;
    return reviews as Review[];
  } catch (error) {
    console.error('取得評測連結失敗:', error);
    return [];
  }
}

// 平台圖示對應
const platformIcons: Record<string, string> = {
  youtube: '📺',
  facebook: '👤',
  instagram: '📷',
};

export default async function PhonePage({
  params,
}: {
  params: Promise<{ phoneId: string }>;
}) {
  const { phoneId } = await params;

  const [phone, reviews, session] = await Promise.all([
    getPhoneDetail(phoneId),
    getReviews(phoneId),
    auth(),
  ]);

  if (!phone) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：產品圖片與價格 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              {/* 手機圖片 */}
              {phone.image_url ? (
                <img
                  src={phone.image_url}
                  alt={`${phone.brand_name} ${phone.model_name}`}
                  className="w-full h-96 object-contain rounded-lg mb-6 bg-white"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-gray-400 text-lg">無圖片</span>
                </div>
              )}

              {/* 價格資訊 */}
              <div className="space-y-3 mb-6">
                <h2 className="text-xl font-bold text-gray-900">價格資訊</h2>
                {phone.official_price && (
                  <div>
                    <p className="text-sm text-gray-500">官方建議售價</p>
                    <p className="text-lg text-gray-600 line-through">
                      NT$ {phone.official_price.toLocaleString()}
                    </p>
                  </div>
                )}
                {phone.our_price ? (
                  <div>
                    <p className="text-sm text-gray-500">本站優惠價</p>
                    <p className="text-3xl font-bold text-red-600">
                      NT$ {phone.our_price.toLocaleString()}
                    </p>
                    {phone.official_price && (
                      <p className="text-sm text-green-600 mt-1">
                        省 NT${' '}
                        {(phone.official_price - phone.our_price).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">價格未定</p>
                )}
              </div>

              {/* 加入購物車按鈕 */}
              <AddToCartButton
                phoneId={phone.id}
                isLoggedIn={!!session?.user}
              />
            </div>
          </div>

          {/* 右側：規格與評測 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 手機名稱 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {phone.brand_name} {phone.model_name}
              </h1>
              {phone.release_date && (
                <p className="text-sm text-gray-500 mt-2">
                  發布日期：{new Date(phone.release_date).toLocaleDateString('zh-TW')}
                </p>
              )}
            </div>

            {/* 規格參數 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">規格參數</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 顯示規格 */}
                {phone.display_size && (
                  <SpecItem label="螢幕尺寸" value={`${phone.display_size} 吋`} />
                )}
                {phone.resolution && (
                  <SpecItem label="解析度" value={phone.resolution} />
                )}
                {phone.weight && (
                  <SpecItem label="重量" value={`${phone.weight} 公克`} />
                )}
                {phone.cpu && <SpecItem label="處理器" value={phone.cpu} />}
                {phone.ram && <SpecItem label="RAM" value={`${phone.ram} GB`} />}
                {phone.storage && <SpecItem label="儲存空間" value={phone.storage} />}
                {phone.main_camera && (
                  <SpecItem label="主相機" value={phone.main_camera} />
                )}
                {phone.front_camera && (
                  <SpecItem label="前相機" value={phone.front_camera} />
                )}
                {phone.battery && (
                  <SpecItem label="電池容量" value={`${phone.battery} mAh`} />
                )}
                {phone.os && <SpecItem label="作業系統" value={phone.os} />}
              </div>
            </div>

            {/* 網路評測 */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">網路評測</h2>
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <a
                      key={review.id}
                      href={review.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {platformIcons[review.platform.toLowerCase()] || '🔗'}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-500 uppercase">
                              {review.platform}
                            </span>
                            {review.published_at && (
                              <span className="text-xs text-gray-400">
                                {new Date(review.published_at).toLocaleDateString(
                                  'zh-TW'
                                )}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900 font-medium">
                            {review.title || '查看評測'}
                          </p>
                          <p className="text-sm text-blue-600 mt-1 truncate">
                            {review.url}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// 規格項目元件
function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-gray-200 pb-2">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-base text-gray-900">{value}</dd>
    </div>
  );
}
