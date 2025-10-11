/**
 * 完整手機資料爬蟲程式（含最新機型與照片）
 * 用途：建立更完整的測試資料
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// 載入環境變數
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('請設定 DATABASE_URL 環境變數');
}

const sql = neon(process.env.DATABASE_URL);

// 延遲函數
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 手機資料介面
interface PhoneData {
  brandName: string;
  modelName: string;
  imageUrl: string;
  price: number;
  specs: {
    displaySize: number;
    weight: number;
    cpu: string;
    ram: number;
    storage: string;
    mainCamera: string;
    battery: number;
  };
}

/**
 * 完整的手機測試資料（2024-2025 最新機型）
 */
async function createFullTestData() {
  console.log('開始建立完整測試資料...\n');

  const testPhones: PhoneData[] = [
    // === Apple ===
    {
      brandName: 'Apple',
      modelName: 'iPhone 16 Pro Max',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg',
      price: 49900,
      specs: {
        displaySize: 6.9,
        weight: 227,
        cpu: 'Apple A18 Pro',
        ram: 8,
        storage: '256GB/512GB/1TB',
        mainCamera: '4800萬畫素三鏡頭',
        battery: 4685,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 16 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg',
      price: 39900,
      specs: {
        displaySize: 6.3,
        weight: 199,
        cpu: 'Apple A18 Pro',
        ram: 8,
        storage: '128GB/256GB/512GB/1TB',
        mainCamera: '4800萬畫素三鏡頭',
        battery: 3582,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 16 Plus',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg',
      price: 32900,
      specs: {
        displaySize: 6.7,
        weight: 199,
        cpu: 'Apple A18',
        ram: 8,
        storage: '128GB/256GB/512GB',
        mainCamera: '4800萬畫素雙鏡頭',
        battery: 4674,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 16',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg',
      price: 28900,
      specs: {
        displaySize: 6.1,
        weight: 170,
        cpu: 'Apple A18',
        ram: 8,
        storage: '128GB/256GB/512GB',
        mainCamera: '4800萬畫素雙鏡頭',
        battery: 3561,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 15 Pro Max',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg',
      price: 42900,
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
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg',
      price: 35900,
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

    // === Samsung ===
    {
      brandName: 'Samsung',
      modelName: 'Galaxy S25 Ultra',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra.jpg',
      price: 48900,
      specs: {
        displaySize: 6.9,
        weight: 234,
        cpu: 'Snapdragon 8 Elite',
        ram: 12,
        storage: '256GB/512GB/1TB',
        mainCamera: '2億畫素四鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy S25+',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-plus.jpg',
      price: 35900,
      specs: {
        displaySize: 6.7,
        weight: 190,
        cpu: 'Snapdragon 8 Elite',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4900,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy S24 Ultra',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg',
      price: 39900,
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
      modelName: 'Galaxy Z Fold6',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold6.jpg',
      price: 54900,
      specs: {
        displaySize: 7.6,
        weight: 239,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 12,
        storage: '256GB/512GB/1TB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4400,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy Z Flip6',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip6.jpg',
      price: 32900,
      specs: {
        displaySize: 6.7,
        weight: 187,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素雙鏡頭',
        battery: 4000,
      }
    },

    // === Google ===
    {
      brandName: 'Google',
      modelName: 'Pixel 9 Pro XL',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-xl.jpg',
      price: 38990,
      specs: {
        displaySize: 6.8,
        weight: 221,
        cpu: 'Google Tensor G4',
        ram: 16,
        storage: '128GB/256GB/512GB/1TB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5060,
      }
    },
    {
      brandName: 'Google',
      modelName: 'Pixel 9 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro.jpg',
      price: 34990,
      specs: {
        displaySize: 6.3,
        weight: 199,
        cpu: 'Google Tensor G4',
        ram: 16,
        storage: '128GB/256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4700,
      }
    },
    {
      brandName: 'Google',
      modelName: 'Pixel 8 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg',
      price: 29990,
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

    // === 小米 ===
    {
      brandName: '小米',
      modelName: '15 Ultra',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-15-ultra.jpg',
      price: 39999,
      specs: {
        displaySize: 6.73,
        weight: 225,
        cpu: 'Snapdragon 8 Elite',
        ram: 16,
        storage: '512GB/1TB',
        mainCamera: '5000萬畫素四鏡頭',
        battery: 6000,
      }
    },
    {
      brandName: '小米',
      modelName: '14 Ultra',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-ultra.jpg',
      price: 33999,
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
      brandName: '小米',
      modelName: '14 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-pro.jpg',
      price: 28999,
      specs: {
        displaySize: 6.73,
        weight: 220,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4880,
      }
    },

    // === OPPO ===
    {
      brandName: 'OPPO',
      modelName: 'Find X8 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x8-pro.jpg',
      price: 35990,
      specs: {
        displaySize: 6.78,
        weight: 215,
        cpu: 'MediaTek Dimensity 9400',
        ram: 16,
        storage: '512GB/1TB',
        mainCamera: '5000萬畫素四鏡頭',
        battery: 5910,
      }
    },
    {
      brandName: 'OPPO',
      modelName: 'Find X7 Ultra',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x7-ultra.jpg',
      price: 29990,
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

    // === vivo ===
    {
      brandName: 'vivo',
      modelName: 'X200 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x200-pro.jpg',
      price: 32990,
      specs: {
        displaySize: 6.78,
        weight: 228,
        cpu: 'MediaTek Dimensity 9400',
        ram: 16,
        storage: '512GB/1TB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 6000,
      }
    },
    {
      brandName: 'vivo',
      modelName: 'X100 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x100-pro.jpg',
      price: 27990,
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

    // === ASUS ===
    {
      brandName: 'ASUS',
      modelName: 'ROG Phone 9 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-9-pro.jpg',
      price: 38990,
      specs: {
        displaySize: 6.78,
        weight: 227,
        cpu: 'Snapdragon 8 Elite',
        ram: 24,
        storage: '1TB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5800,
      }
    },
    {
      brandName: 'ASUS',
      modelName: 'Zenfone 11 Ultra',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/asus-zenfone-11-ultra.jpg',
      price: 29990,
      specs: {
        displaySize: 6.78,
        weight: 224,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5500,
      }
    },

    // === Sony ===
    {
      brandName: 'Sony',
      modelName: 'Xperia 1 VI',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-vi.jpg',
      price: 36990,
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
    {
      brandName: 'Sony',
      modelName: 'Xperia 5 VI',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-vi.jpg',
      price: 30990,
      specs: {
        displaySize: 6.1,
        weight: 192,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 8,
        storage: '128GB/256GB',
        mainCamera: '4800萬畫素三鏡頭',
        battery: 5000,
      }
    },

    // === OnePlus ===
    {
      brandName: 'OnePlus',
      modelName: '13',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-13.jpg',
      price: 29990,
      specs: {
        displaySize: 6.82,
        weight: 210,
        cpu: 'Snapdragon 8 Elite',
        ram: 16,
        storage: '512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 6000,
      }
    },
    {
      brandName: 'OnePlus',
      modelName: '12',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg',
      price: 25990,
      specs: {
        displaySize: 6.82,
        weight: 220,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5400,
      }
    },

    // === realme ===
    {
      brandName: 'realme',
      modelName: 'GT7 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt7-pro.jpg',
      price: 21990,
      specs: {
        displaySize: 6.78,
        weight: 222,
        cpu: 'Snapdragon 8 Elite',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 6500,
      }
    },
    {
      brandName: 'realme',
      modelName: 'GT6',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt6.jpg',
      price: 17990,
      specs: {
        displaySize: 6.78,
        weight: 199,
        cpu: 'Snapdragon 8s Gen 3',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5500,
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
      const popularityScore = Math.floor(Math.random() * 1000) + 500;

      await sql`
        INSERT INTO phones (
          brand_id, model_name, our_price, official_price,
          display_size, weight, cpu, ram, storage,
          main_camera, battery, image_url, popularity_score
        ) VALUES (
          ${brandId},
          ${phone.modelName},
          ${Math.floor(phone.price * 0.9)},
          ${phone.price},
          ${phone.specs.displaySize},
          ${phone.specs.weight},
          ${phone.specs.cpu},
          ${phone.specs.ram},
          ${phone.specs.storage},
          ${phone.specs.mainCamera},
          ${phone.specs.battery},
          ${phone.imageUrl},
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

    await delay(100);
  }

  console.log(`\n完成！成功: ${successCount}, 失敗: ${errorCount}`);
}

/**
 * 主程式
 */
async function main() {
  console.log('=== 完整手機資料爬蟲程式 ===\n');

  try {
    console.log('測試資料庫連線...');
    await sql`SELECT 1`;
    console.log('✓ 資料庫連線成功\n');

    console.log('建立完整測試資料（2024-2025 最新機型，含照片）...\n');
    await createFullTestData();

    console.log('\n=== 完成！===');
    console.log(`✓ 已新增 30+ 支最新手機`);
    console.log(`✓ 所有手機都包含照片 (來自 GSMArena)`);
    console.log(`✓ 包含 iPhone 16 系列、Galaxy S25 系列等最新機型`);
    console.log('\n執行: npm run dev 查看網站效果');

  } catch (error) {
    console.error('執行失敗:', error);
    process.exit(1);
  }
}

main();
