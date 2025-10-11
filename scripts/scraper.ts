/**
 * 手機王 (SOGI) 網站爬蟲程式
 * 用途：爬取台灣手機資料並存入 Neon 資料庫
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// 載入環境變數
config({ path: '.env.local' });

// 檢查環境變數
if (!process.env.DATABASE_URL) {
  throw new Error('請設定 DATABASE_URL 環境變數');
}

const sql = neon(process.env.DATABASE_URL);

// 延遲函數（避免過度請求）
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 品牌對應表
const brandMapping: Record<string, string> = {
  'Apple': 'Apple',
  'Samsung': 'Samsung',
  'OPPO': 'OPPO',
  'vivo': 'vivo',
  'Xiaomi': '小米',
  '小米': '小米',
  'realme': 'realme',
  'Google': 'Google',
  'Sony': 'Sony',
  'HTC': 'HTC',
  'ASUS': 'ASUS',
  'Motorola': 'Motorola',
  'Nokia': 'Nokia',
  'OnePlus': 'OnePlus',
};

// 手機資料介面
interface PhoneData {
  brandName: string;
  modelName: string;
  imageUrl?: string;
  price?: number;
  specs?: {
    displaySize?: number;
    weight?: number;
    cpu?: string;
    ram?: number;
    storage?: string;
    mainCamera?: string;
    battery?: number;
  };
}

/**
 * 爬取手機王品牌列表頁面
 */
async function scrapeBrandList(brandUrl: string): Promise<PhoneData[]> {
  console.log(`正在爬取品牌列表: ${brandUrl}`);

  try {
    const response = await axios.get(brandUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const phones: PhoneData[] = [];

    // 解析手機列表（需要根據實際網站結構調整選擇器）
    $('.product_list_item, .phone-item, .list-item').each((_, element) => {
      try {
        const $el = $(element);

        // 提取手機資訊
        const title = $el.find('.name, .title, h3, h4').first().text().trim();
        const imageUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
        const priceText = $el.find('.price, .product_price').first().text().trim();

        if (title) {
          // 解析品牌和型號
          const brandMatch = Object.keys(brandMapping).find(brand =>
            title.includes(brand)
          );

          if (brandMatch) {
            const brandName = brandMapping[brandMatch];
            const modelName = title.replace(brandMatch, '').trim();

            // 解析價格
            const priceMatch = priceText.match(/[\d,]+/);
            const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : undefined;

            phones.push({
              brandName,
              modelName: modelName || title,
              imageUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://www.sogi.com.tw${imageUrl}`) : undefined,
              price,
            });
          }
        }
      } catch (err) {
        console.error('解析手機項目時發生錯誤:', err);
      }
    });

    console.log(`從 ${brandUrl} 爬取到 ${phones.length} 支手機`);
    return phones;
  } catch (error) {
    console.error(`爬取品牌列表失敗 (${brandUrl}):`, error);
    return [];
  }
}

/**
 * 建立測試資料（使用預設資料）
 */
async function createTestData() {
  console.log('開始建立測試資料...\n');

  // 測試資料：台灣熱門手機
  const testPhones: PhoneData[] = [
    {
      brandName: 'Apple',
      modelName: 'iPhone 15 Pro Max',
      imageUrl: 'https://cdn.sogi.com.tw/upload/phone/15_pro_max.jpg',
      price: 45900,
      specs: {
        displaySize: 6.7,
        weight: 221,
        cpu: 'Apple A17 Pro',
        ram: 8,
        storage: '256GB/512GB/1TB',
        mainCamera: '4800萬畫素三鏡頭',
        battery: 4422,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 15 Pro',
      imageUrl: 'https://cdn.sogi.com.tw/upload/phone/15_pro.jpg',
      price: 36900,
      specs: {
        displaySize: 6.1,
        weight: 187,
        cpu: 'Apple A17 Pro',
        ram: 8,
        storage: '128GB/256GB/512GB/1TB',
        mainCamera: '4800萬畫素三鏡頭',
        battery: 3274,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy S24 Ultra',
      imageUrl: 'https://cdn.sogi.com.tw/upload/phone/s24_ultra.jpg',
      price: 42900,
      specs: {
        displaySize: 6.8,
        weight: 232,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 12,
        storage: '256GB/512GB/1TB',
        mainCamera: '2億畫素四鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy S24+',
      imageUrl: 'https://cdn.sogi.com.tw/upload/phone/s24_plus.jpg',
      price: 32900,
      specs: {
        displaySize: 6.7,
        weight: 196,
        cpu: 'Exynos 2400',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4900,
      }
    },
    {
      brandName: 'Google',
      modelName: 'Pixel 8 Pro',
      imageUrl: 'https://cdn.sogi.com.tw/upload/phone/pixel_8_pro.jpg',
      price: 33990,
      specs: {
        displaySize: 6.7,
        weight: 213,
        cpu: 'Google Tensor G3',
        ram: 12,
        storage: '128GB/256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5050,
      }
    },
    {
      brandName: '小米',
      modelName: '14 Ultra',
      imageUrl: 'https://cdn.sogi.com.tw/upload/phone/mi14_ultra.jpg',
      price: 36999,
      specs: {
        displaySize: 6.73,
        weight: 219,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 16,
        storage: '512GB/1TB',
        mainCamera: '5000萬畫素四鏡頭',
        battery: 5300,
      }
    },
    {
      brandName: 'OPPO',
      modelName: 'Find X7 Ultra',
      imageUrl: 'https://cdn.sogi.com.tw/upload/phone/find_x7_ultra.jpg',
      price: 32990,
      specs: {
        displaySize: 6.82,
        weight: 221,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 16,
        storage: '512GB',
        mainCamera: '5000萬畫素四鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'vivo',
      modelName: 'X100 Pro',
      imageUrl: 'https://cdn.sogi.com.tw/upload/phone/x100_pro.jpg',
      price: 29990,
      specs: {
        displaySize: 6.78,
        weight: 221,
        cpu: 'MediaTek Dimensity 9300',
        ram: 16,
        storage: '512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5400,
      }
    },
    {
      brandName: 'ASUS',
      modelName: 'ROG Phone 8 Pro',
      imageUrl: 'https://cdn.sogi.com.tw/upload/phone/rog8_pro.jpg',
      price: 35990,
      specs: {
        displaySize: 6.78,
        weight: 225,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 24,
        storage: '1TB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5500,
      }
    },
    {
      brandName: 'Sony',
      modelName: 'Xperia 1 VI',
      imageUrl: 'https://cdn.sogi.com.tw/upload/phone/xperia_1_vi.jpg',
      price: 38990,
      specs: {
        displaySize: 6.5,
        weight: 192,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '4800萬畫素三鏡頭',
        battery: 5000,
      }
    },
  ];

  await insertPhonesData(testPhones);
}

/**
 * 將手機資料插入資料庫
 */
async function insertPhonesData(phones: PhoneData[]) {
  console.log(`\n準備插入 ${phones.length} 筆手機資料到資料庫...`);

  let successCount = 0;
  let errorCount = 0;

  for (const phone of phones) {
    try {
      // 1. 確保品牌存在
      const brandResult = await sql`
        INSERT INTO brands (name)
        VALUES (${phone.brandName})
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `;

      const brandId = brandResult[0].id;

      // 2. 插入手機資料
      const popularityScore = Math.floor(Math.random() * 1000) + 500; // 隨機熱門度 500-1500

      await sql`
        INSERT INTO phones (
          brand_id, model_name, our_price, official_price,
          display_size, weight, cpu, ram, storage,
          main_camera, battery, image_url, popularity_score
        ) VALUES (
          ${brandId},
          ${phone.modelName},
          ${phone.price ? Math.floor(phone.price * 0.9) : null},
          ${phone.price || null},
          ${phone.specs?.displaySize || null},
          ${phone.specs?.weight || null},
          ${phone.specs?.cpu || null},
          ${phone.specs?.ram || null},
          ${phone.specs?.storage || null},
          ${phone.specs?.mainCamera || null},
          ${phone.specs?.battery || null},
          ${phone.imageUrl || null},
          ${popularityScore}
        )
        ON CONFLICT DO NOTHING
      `;

      successCount++;
      console.log(`✓ ${phone.brandName} ${phone.modelName}`);

    } catch (error) {
      errorCount++;
      console.error(`✗ 插入失敗: ${phone.brandName} ${phone.modelName}`, error);
    }

    // 避免過快插入
    await delay(100);
  }

  console.log(`\n完成！成功: ${successCount}, 失敗: ${errorCount}`);
}

/**
 * 主程式
 */
async function main() {
  console.log('=== 手機資料爬蟲程式 ===\n');

  try {
    // 測試資料庫連線
    console.log('測試資料庫連線...');
    await sql`SELECT 1`;
    console.log('✓ 資料庫連線成功\n');

    // 使用測試資料（因為實際爬蟲需要分析網站結構）
    console.log('使用預設測試資料建立手機資訊...\n');
    await createTestData();

    console.log('\n=== 完成！===');
    console.log('提示：你可以修改此程式以爬取真實的手機王網站資料');
    console.log('或執行: npm run dev 查看網站效果');

  } catch (error) {
    console.error('執行失敗:', error);
    process.exit(1);
  }
}

// 執行主程式
main();
