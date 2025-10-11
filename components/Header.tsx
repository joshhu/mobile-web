import Link from 'next/link';
import { sql } from '@/lib/db';

// 品牌介面
interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
}

// 取得所有品牌
async function getBrands(): Promise<Brand[]> {
  try {
    const brands = await sql`
      SELECT id, name, logo_url
      FROM brands
      ORDER BY name
    `;
    return brands as Brand[];
  } catch (error) {
    console.error('取得品牌資料失敗:', error);
    return [];
  }
}

export default async function Header() {
  const brands = await getBrands();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo 與網站標題 */}
        <div className="flex items-center justify-between py-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">📱 MobileWeb</div>
            <span className="text-sm text-gray-500 hidden sm:inline">台灣手機電商平台</span>
          </Link>

          {/* 可以在這裡加入搜尋框或其他功能 */}
          <div className="text-sm text-gray-600">
            <span className="hidden md:inline">最新、最齊全的手機資訊</span>
          </div>
        </div>

        {/* 品牌導航列 */}
        <nav className="py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">品牌：</span>
            <Link
              href="/"
              className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 whitespace-nowrap transition-colors"
            >
              全部
            </Link>
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${encodeURIComponent(brand.name)}`}
                className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 whitespace-nowrap transition-colors"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
