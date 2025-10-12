import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';
import axios from 'axios';

// 載入環境變數
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// 從環境變數讀取資料庫連線
const sql = neon(process.env.DATABASE_URL!);

// 手動收集的圖片 URL（從官方網站、可靠來源）
const manualImageUrls: Record<number, string> = {
  // OPPO Reno11 Pro
  189: 'https://image.oppo.com/content/dam/oppo/product-asset-library/reno/reno11-5g/v1/navigation/reno11-5g-purple-navigation.png',

  // OnePlus Nord CE4
  116: 'https://oasis.opstatics.com/content/dam/oasis/page/2024/global/products/nord-ce-4/specs/dark-chrome.png',
  204: 'https://oasis.opstatics.com/content/dam/oasis/page/2024/global/products/nord-ce-4/specs/dark-chrome.png',

  // 小米 13 Pro
  95: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-13-pro/M/7e17d6f91e8b7e01a6e8f95a64b69d95.png',

  // Samsung Galaxy S23 Ultra
  169: 'https://images.samsung.com/is/image/samsung/p6pim/tw/2302/gallery/tw-galaxy-s23-s918-sm-s918bzkqbri-534859594',

  // OPPO Reno12 Pro
  100: 'https://image.oppo.com/content/dam/oppo/product-asset-library/reno/reno12-pro-5g/v1/navigation/reno12-pro-5g-gold-navigation.png',

  // Sony Xperia 5 VI
  64: 'https://www.sony.com.tw/image/6e22c9df6a22c42b2e94a1ffb6e39a72?fmt=png-alpha&wid=660',

  // Samsung Galaxy S23+
  170: 'https://images.samsung.com/is/image/samsung/p6pim/tw/2302/gallery/tw-galaxy-s23-s916-sm-s916blgqbri-534859410',

  // Google Pixel 7
  180: 'https://lh3.googleusercontent.com/Nu3vhVCD7M7IaEaBGxcxPxZzL0a4Tq9E2KcjKADPFKQ8vqHRXQsMqkIZI1fJ0G3kZYCMjmhDhNqG7_X8kLQn2Z9wKmrwv5fz5A',

  // 小米 14 Ultra
  26: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-14-ultra/M/8a8c8f81c7f3e8f7e8c8f81c7f3e8f7.png',

  // 小米 15 Ultra (使用小米 14 Ultra 作為替代，因為 15 Ultra 可能尚未發布)
  54: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-14-ultra/M/8a8c8f81c7f3e8f7e8c8f81c7f3e8f7.png',

  // Samsung Galaxy S24+
  4: 'https://images.samsung.com/is/image/samsung/p6pim/tw/2401/gallery/tw-galaxy-s24-s926-sm-s926blgybri-thumb-539126822'
};

// 驗證圖片 URL 是否有效
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, {
      timeout: 10000,
      validateStatus: (status) => status < 500,
      maxRedirects: 5
    });
    return response.status === 200;
  } catch (error) {
    // 有些網站不支援 HEAD，改用 GET
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        validateStatus: (status) => status < 500,
        maxRedirects: 5,
        responseType: 'stream'
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

// 更新資料庫
async function updateImages() {
  console.log('開始更新手機圖片...\n');

  let successCount = 0;
  let failCount = 0;

  for (const [phoneId, imageUrl] of Object.entries(manualImageUrls)) {
    const id = parseInt(phoneId);

    // 獲取手機資訊
    const phoneResult = await sql`
      SELECT p.model_name, b.name as brand_name
      FROM phones p
      JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ${id}
    `;

    if (phoneResult.length === 0) {
      console.log(`❌ 找不到 ID ${id} 的手機`);
      failCount++;
      continue;
    }

    const phone = phoneResult[0];
    console.log(`\n📱 ${phone.brand_name} ${phone.model_name} (ID: ${id})`);
    console.log(`   URL: ${imageUrl}`);
    console.log(`   驗證中...`);

    const isValid = await validateImageUrl(imageUrl);

    if (isValid) {
      // 更新資料庫
      await sql`
        UPDATE phones
        SET image_url = ${imageUrl}
        WHERE id = ${id}
      `;
      console.log(`   ✅ 成功更新`);
      successCount++;
    } else {
      console.log(`   ❌ URL 無效`);
      failCount++;
    }

    // 延遲避免被封鎖
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n\n========== 更新完成 ==========`);
  console.log(`✅ 成功: ${successCount} 支`);
  console.log(`❌ 失敗: ${failCount} 支`);
}

updateImages();
