import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL!);

async function verify() {
  const result = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(image_url) as with_images,
      COUNT(*) - COUNT(image_url) as without_images
    FROM phones
  `;
  
  const brands = await sql`
    SELECT b.name, COUNT(p.id) as phone_count
    FROM brands b
    LEFT JOIN phones p ON b.id = p.brand_id
    GROUP BY b.name
    ORDER BY phone_count DESC
  `;
  
  console.log('=== 資料庫統計 ===');
  console.log(`總手機數：${result[0].total}`);
  console.log(`有照片：${result[0].with_images}`);
  console.log(`無照片：${result[0].without_images}`);
  console.log('\n=== 各品牌手機數量 ===');
  brands.forEach((b: any) => {
    console.log(`${b.name}: ${b.phone_count} 支`);
  });
}

verify();
