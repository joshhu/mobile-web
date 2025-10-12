import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';
import axios from 'axios';

// 載入環境變數
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// 從環境變數讀取資料庫連線
const sql = neon(process.env.DATABASE_URL!);

async function testImageUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      validateStatus: (status) => status < 500
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

async function testImageUrls() {
  try {
    console.log('正在測試首頁前 40 支手機的圖片 URL...\n');

    // 獲取首頁顯示的前 40 支手機
    const phones = await sql`
      SELECT p.id, p.model_name, b.name as brand_name, p.image_url
      FROM phones p
      JOIN brands b ON p.brand_id = b.id
      ORDER BY p.popularity_score DESC
      LIMIT 40
    `;

    let workingCount = 0;
    let brokenCount = 0;
    const brokenPhones: any[] = [];

    for (let i = 0; i < phones.length; i++) {
      const phone = phones[i];
      const isWorking = await testImageUrl(phone.image_url);

      const status = isWorking ? '✅ OK' : '❌ BROKEN';
      console.log(`${i + 1}. ${phone.brand_name} ${phone.model_name}: ${status}`);

      if (isWorking) {
        workingCount++;
      } else {
        brokenCount++;
        brokenPhones.push({
          rank: i + 1,
          brand: phone.brand_name,
          model: phone.model_name,
          url: phone.image_url,
          id: phone.id
        });
      }
    }

    console.log(`\n總計: ${phones.length} 支手機`);
    console.log(`✅ 正常圖片: ${workingCount} 支`);
    console.log(`❌ 失效圖片: ${brokenCount} 支`);

    if (brokenPhones.length > 0) {
      console.log('\n需要修復的手機清單：');
      brokenPhones.forEach(p => {
        console.log(`\n${p.rank}. ${p.brand} ${p.model} (ID: ${p.id})`);
        console.log(`   URL: ${p.url}`);
      });
    }

  } catch (error) {
    console.error('錯誤:', error);
  }
}

testImageUrls();
