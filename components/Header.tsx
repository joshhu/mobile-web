import Link from 'next/link';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';
import UserDropdown from '@/components/UserDropdown';

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

// 取得購物車數量
async function getCartCount(userId: string): Promise<number> {
  try {
    const result = await sql`
      SELECT SUM(quantity) as total
      FROM cart_items
      WHERE user_id = ${userId}
    `;
    return Number(result[0]?.total || 0);
  } catch (error) {
    console.error('取得購物車數量失敗:', error);
    return 0;
  }
}

export default async function Header() {
  const brands = await getBrands();
  const session = await auth();
  const cartCount = session?.user?.id ? await getCartCount(session.user.id) : 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo 與網站標題 */}
        <div className="flex items-center justify-between py-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">📱 MobileWeb</div>
            <span className="text-sm text-gray-500 hidden sm:inline">台灣手機電商平台</span>
          </Link>

          {/* 使用者登入狀態與購物車 */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                {/* 購物車圖示 */}
                <Link
                  href="/cart"
                  className="relative text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* 使用者下拉選單 */}
                <UserDropdown userName={session.user?.name || session.user?.email} />
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                登入
              </Link>
            )}
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
