import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 載入環境變數
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// 從環境變數讀取資料庫連線
const sql = neon(process.env.DATABASE_URL!);

async function checkHomepageImages() {
  try {
    console.log('正在檢查首頁前 40 支手機的圖片狀況...\n');

    // 獲取首頁顯示的前 40 支手機（依照 popularity_score 排序）
    const phones = await sql`
      SELECT p.id, p.model_name, b.name as brand_name, p.image_url, p.popularity_score
      FROM phones p
      JOIN brands b ON p.brand_id = b.id
      ORDER BY p.popularity_score DESC
      LIMIT 40
    `;

    let missingCount = 0;
    const missingPhones: any[] = [];

    for (let i = 0; i < phones.length; i++) {
      const phone = phones[i];
      const hasImage = phone.image_url && phone.image_url.trim() !== '';

      console.log(`${i + 1}. ${phone.brand_name} ${phone.model_name}`);
      console.log(`   圖片: ${hasImage ? phone.image_url : '❌ 缺少圖片'}`);

      if (!hasImage) {
        missingCount++;
        missingPhones.push({
          rank: i + 1,
          brand: phone.brand_name,
          model: phone.model_name,
          id: phone.id
        });
      }
      console.log('');
    }

    console.log(`\n總計: ${phones.length} 支手機`);
    console.log(`缺少圖片: ${missingCount} 支`);
    console.log(`有圖片: ${phones.length - missingCount} 支`);

    if (missingPhones.length > 0) {
      console.log('\n需要補充圖片的手機清單：');
      missingPhones.forEach(p => {
        console.log(`  ${p.rank}. ${p.brand} ${p.model} (ID: ${p.id})`);
      });
    }

  } catch (error) {
    console.error('錯誤:', error);
  }
}

checkHomepageImages();
