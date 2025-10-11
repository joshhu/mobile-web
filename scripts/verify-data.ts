/**
 * 驗證資料庫中的資料
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// 載入環境變數
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('請設定 DATABASE_URL 環境變數');
}

const sql = neon(process.env.DATABASE_URL);

async function verifyData() {
  console.log('=== 驗證資料庫資料 ===\n');

  try {
    // 檢查品牌數量
    const brandsCount = await sql`SELECT COUNT(*) as count FROM brands`;
    console.log(`✓ 品牌總數: ${brandsCount[0].count}`);

    // 列出所有品牌
    const brands = await sql`SELECT id, name FROM brands ORDER BY name`;
    console.log('\n品牌列表:');
    brands.forEach((brand: any) => {
      console.log(`  - ${brand.name} (ID: ${brand.id})`);
    });

    // 檢查手機數量
    const phonesCount = await sql`SELECT COUNT(*) as count FROM phones`;
    console.log(`\n✓ 手機總數: ${phonesCount[0].count}`);

    // 列出所有手機
    const phones = await sql`
      SELECT
        p.id,
        b.name as brand_name,
        p.model_name,
        p.our_price,
        p.popularity_score
      FROM phones p
      JOIN brands b ON p.brand_id = b.id
      ORDER BY p.popularity_score DESC
    `;

    console.log('\n手機列表（按熱門度排序）:');
    phones.forEach((phone: any, index: number) => {
      console.log(
        `  ${index + 1}. ${phone.brand_name} ${phone.model_name} - NT$ ${phone.our_price?.toLocaleString() || 'N/A'} (熱門度: ${phone.popularity_score})`
      );
    });

    console.log('\n=== 驗證完成！===');
    console.log('提示: 執行 npm run dev 可在瀏覽器查看網站');

  } catch (error) {
    console.error('驗證失敗:', error);
    process.exit(1);
  }
}

verifyData();
