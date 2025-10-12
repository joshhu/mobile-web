import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 載入環境變數
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// 從環境變數讀取資料庫連線
const sql = neon(process.env.DATABASE_URL!);

// 從 GSMArena 獲取的正確圖片 URL
const fixedImageUrls: Record<number, string> = {
  // OPPO Reno11 Pro (ID: 189)
  189: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno11-china.jpg',

  // OnePlus Nord CE4 (ID: 116, 204 - 重複)
  116: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce4-.jpg',
  204: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce4-.jpg',

  // 小米 13 Pro (ID: 95)
  95: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-pro-black.jpg',

  // Samsung Galaxy S23 Ultra (ID: 169)
  169: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg',

  // OPPO Reno12 Pro (ID: 100)
  100: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno12-pro-cn.jpg',

  // Sony Xperia 5 VI (ID: 64) - 使用 Xperia 1 VI 替代，因為 5 VI 尚未發布
  64: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-vi-red.jpg',

  // Samsung Galaxy S23+ (ID: 170)
  170: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-plus-5g.jpg',

  // Google Pixel 7 (ID: 180)
  180: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-new.jpg',

  // 小米 14 Ultra (ID: 26)
  26: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-ultra-new.jpg',

  // 小米 15 Ultra (ID: 54)
  54: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-15-ultra-.jpg',

  // Samsung Galaxy S24+ (ID: 4)
  4: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus-5g-sm-s926.jpg'
};

async function updateBrokenImages() {
  console.log('開始更新失效的手機圖片...\n');

  let successCount = 0;
  let totalCount = 0;

  for (const [phoneIdStr, imageUrl] of Object.entries(fixedImageUrls)) {
    const phoneId = parseInt(phoneIdStr);
    totalCount++;

    try {
      // 獲取手機資訊
      const phoneResult = await sql`
        SELECT p.model_name, b.name as brand_name, p.image_url as old_url
        FROM phones p
        JOIN brands b ON p.brand_id = b.id
        WHERE p.id = ${phoneId}
      `;

      if (phoneResult.length === 0) {
        console.log(`❌ 找不到 ID ${phoneId} 的手機`);
        continue;
      }

      const phone = phoneResult[0];
      console.log(`${totalCount}. ${phone.brand_name} ${phone.model_name} (ID: ${phoneId})`);
      console.log(`   舊 URL: ${phone.old_url}`);
      console.log(`   新 URL: ${imageUrl}`);

      // 更新資料庫
      await sql`
        UPDATE phones
        SET image_url = ${imageUrl}
        WHERE id = ${phoneId}
      `;

      console.log(`   ✅ 更新成功\n`);
      successCount++;

    } catch (error) {
      console.log(`   ❌ 更新失敗: ${error instanceof Error ? error.message : '未知錯誤'}\n`);
    }
  }

  console.log('========== 更新完成 ==========');
  console.log(`總計: ${totalCount} 支手機`);
  console.log(`✅ 成功: ${successCount} 支`);
  console.log(`❌ 失敗: ${totalCount - successCount} 支`);
}

updateBrokenImages();
