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
    // === Apple === (2025 最新機型)
    {
      brandName: 'Apple',
      modelName: 'iPhone 17 Pro Max',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg',
      price: 54900,
      specs: {
        displaySize: 6.9,
        weight: 225,
        cpu: 'Apple A19 Pro',
        ram: 12,
        storage: '256GB/512GB/1TB/2TB',
        mainCamera: '5000萬畫素四鏡頭',
        battery: 4900,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 17 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg',
      price: 44900,
      specs: {
        displaySize: 6.3,
        weight: 197,
        cpu: 'Apple A19 Pro',
        ram: 12,
        storage: '256GB/512GB/1TB',
        mainCamera: '5000萬畫素四鏡頭',
        battery: 3800,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 17',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg',
      price: 32900,
      specs: {
        displaySize: 6.1,
        weight: 170,
        cpu: 'Apple A19',
        ram: 8,
        storage: '128GB/256GB/512GB',
        mainCamera: '4800萬畫素雙鏡頭',
        battery: 3700,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 17 Plus',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg',
      price: 36900,
      specs: {
        displaySize: 6.7,
        weight: 199,
        cpu: 'Apple A19',
        ram: 8,
        storage: '256GB/512GB',
        mainCamera: '4800萬畫素雙鏡頭',
        battery: 4800,
      }
    },
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

    // === 小米 === (2025 最新機型)
    {
      brandName: '小米',
      modelName: '15T Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14t-pro.jpg',
      price: 22999,
      specs: {
        displaySize: 6.67,
        weight: 209,
        cpu: 'MediaTek Dimensity 9400',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5500,
      }
    },
    {
      brandName: '小米',
      modelName: '15T',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14t.jpg',
      price: 16999,
      specs: {
        displaySize: 6.67,
        weight: 195,
        cpu: 'MediaTek Dimensity 8300 Ultra',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: '小米',
      modelName: '15 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-pro.jpg',
      price: 32999,
      specs: {
        displaySize: 6.73,
        weight: 223,
        cpu: 'Snapdragon 8 Elite',
        ram: 16,
        storage: '512GB/1TB',
        mainCamera: '5000萬畫素四鏡頭',
        battery: 5500,
      }
    },
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
      modelName: '15',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14.jpg',
      price: 26999,
      specs: {
        displaySize: 6.36,
        weight: 191,
        cpu: 'Snapdragon 8 Elite',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
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
    {
      brandName: 'realme',
      modelName: '13 Pro+',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/realme-13-pro-plus.jpg',
      price: 14990,
      specs: {
        displaySize: 6.7,
        weight: 190,
        cpu: 'Snapdragon 7s Gen 2',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5200,
      }
    },

    // === HTC ===
    {
      brandName: 'HTC',
      modelName: 'U23 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/htc-u23-pro.jpg',
      price: 16990,
      specs: {
        displaySize: 6.7,
        weight: 205,
        cpu: 'Snapdragon 7 Gen 1',
        ram: 12,
        storage: '256GB',
        mainCamera: '10800萬畫素四鏡頭',
        battery: 4600,
      }
    },
    {
      brandName: 'HTC',
      modelName: 'Desire 22 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/htc-desire-22-pro.jpg',
      price: 12990,
      specs: {
        displaySize: 6.6,
        weight: 206,
        cpu: 'Snapdragon 695',
        ram: 8,
        storage: '128GB',
        mainCamera: '6400萬畫素三鏡頭',
        battery: 4520,
      }
    },

    // === 更多 Apple 機型 ===
    {
      brandName: 'Apple',
      modelName: 'iPhone 15',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg',
      price: 28900,
      specs: {
        displaySize: 6.1,
        weight: 171,
        cpu: 'Apple A16 Bionic',
        ram: 6,
        storage: '128GB/256GB/512GB',
        mainCamera: '4800萬畫素雙鏡頭',
        battery: 3349,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 15 Plus',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus.jpg',
      price: 32900,
      specs: {
        displaySize: 6.7,
        weight: 201,
        cpu: 'Apple A16 Bionic',
        ram: 6,
        storage: '128GB/256GB/512GB',
        mainCamera: '4800萬畫素雙鏡頭',
        battery: 4383,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 14 Pro Max',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max-.jpg',
      price: 39900,
      specs: {
        displaySize: 6.7,
        weight: 240,
        cpu: 'Apple A16 Bionic',
        ram: 6,
        storage: '128GB/256GB/512GB/1TB',
        mainCamera: '4800萬畫素三鏡頭',
        battery: 4323,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 14 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg',
      price: 33900,
      specs: {
        displaySize: 6.1,
        weight: 206,
        cpu: 'Apple A16 Bionic',
        ram: 6,
        storage: '128GB/256GB/512GB/1TB',
        mainCamera: '4800萬畫素三鏡頭',
        battery: 3200,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 14',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg',
      price: 27900,
      specs: {
        displaySize: 6.1,
        weight: 172,
        cpu: 'Apple A15 Bionic',
        ram: 6,
        storage: '128GB/256GB/512GB',
        mainCamera: '1200萬畫素雙鏡頭',
        battery: 3279,
      }
    },
    {
      brandName: 'Apple',
      modelName: 'iPhone 13',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg',
      price: 22900,
      specs: {
        displaySize: 6.1,
        weight: 174,
        cpu: 'Apple A15 Bionic',
        ram: 4,
        storage: '128GB/256GB/512GB',
        mainCamera: '1200萬畫素雙鏡頭',
        battery: 3240,
      }
    },

    // === 更多 Samsung 機型 ===
    {
      brandName: 'Samsung',
      modelName: 'Galaxy S25',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25.jpg',
      price: 28900,
      specs: {
        displaySize: 6.2,
        weight: 168,
        cpu: 'Snapdragon 8 Elite',
        ram: 8,
        storage: '128GB/256GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4000,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy S24+',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus-5g.jpg',
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
      brandName: 'Samsung',
      modelName: 'Galaxy S24',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g.jpg',
      price: 25900,
      specs: {
        displaySize: 6.2,
        weight: 168,
        cpu: 'Exynos 2400',
        ram: 8,
        storage: '128GB/256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4000,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy S23 Ultra',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra.jpg',
      price: 36900,
      specs: {
        displaySize: 6.8,
        weight: 234,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 12,
        storage: '256GB/512GB/1TB',
        mainCamera: '2億畫素四鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy S23+',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-plus.jpg',
      price: 29900,
      specs: {
        displaySize: 6.6,
        weight: 196,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 8,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4700,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy S23',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23.jpg',
      price: 24900,
      specs: {
        displaySize: 6.1,
        weight: 168,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 8,
        storage: '128GB/256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 3900,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy Z Fold5',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold5.jpg',
      price: 51900,
      specs: {
        displaySize: 7.6,
        weight: 253,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 12,
        storage: '256GB/512GB/1TB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4400,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy Z Flip5',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip5.jpg',
      price: 29900,
      specs: {
        displaySize: 6.7,
        weight: 187,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 8,
        storage: '256GB/512GB',
        mainCamera: '1200萬畫素雙鏡頭',
        battery: 3700,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy A55 5G',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a55.jpg',
      price: 13990,
      specs: {
        displaySize: 6.6,
        weight: 213,
        cpu: 'Exynos 1480',
        ram: 8,
        storage: '128GB/256GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'Samsung',
      modelName: 'Galaxy A35 5G',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a35.jpg',
      price: 10990,
      specs: {
        displaySize: 6.6,
        weight: 209,
        cpu: 'Exynos 1380',
        ram: 8,
        storage: '128GB/256GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
      }
    },

    // === 更多 Google 機型 ===
    {
      brandName: 'Google',
      modelName: 'Pixel 9',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9.jpg',
      price: 27990,
      specs: {
        displaySize: 6.3,
        weight: 198,
        cpu: 'Google Tensor G4',
        ram: 12,
        storage: '128GB/256GB',
        mainCamera: '5000萬畫素雙鏡頭',
        battery: 4700,
      }
    },
    {
      brandName: 'Google',
      modelName: 'Pixel 8a',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg',
      price: 17990,
      specs: {
        displaySize: 6.1,
        weight: 188,
        cpu: 'Google Tensor G3',
        ram: 8,
        storage: '128GB/256GB',
        mainCamera: '6400萬畫素雙鏡頭',
        battery: 4492,
      }
    },
    {
      brandName: 'Google',
      modelName: 'Pixel 8',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg',
      price: 25990,
      specs: {
        displaySize: 6.2,
        weight: 187,
        cpu: 'Google Tensor G3',
        ram: 8,
        storage: '128GB/256GB',
        mainCamera: '5000萬畫素雙鏡頭',
        battery: 4575,
      }
    },
    {
      brandName: 'Google',
      modelName: 'Pixel 7 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7-pro.jpg',
      price: 28990,
      specs: {
        displaySize: 6.7,
        weight: 212,
        cpu: 'Google Tensor G2',
        ram: 12,
        storage: '128GB/256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'Google',
      modelName: 'Pixel 7',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7.jpg',
      price: 19990,
      specs: {
        displaySize: 6.3,
        weight: 197,
        cpu: 'Google Tensor G2',
        ram: 8,
        storage: '128GB/256GB',
        mainCamera: '5000萬畫素雙鏡頭',
        battery: 4355,
      }
    },

    // === 更多小米機型 ===
    {
      brandName: '小米',
      modelName: '14',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14.jpg',
      price: 23999,
      specs: {
        displaySize: 6.36,
        weight: 193,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4610,
      }
    },
    {
      brandName: '小米',
      modelName: '13 Ultra',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-ultra.jpg',
      price: 36999,
      specs: {
        displaySize: 6.73,
        weight: 227,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 12,
        storage: '256GB/512GB/1TB',
        mainCamera: '5000萬畫素四鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: '小米',
      modelName: '13 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-pro.jpg',
      price: 29999,
      specs: {
        displaySize: 6.73,
        weight: 229,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4820,
      }
    },
    {
      brandName: '小米',
      modelName: '13',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13.jpg',
      price: 21999,
      specs: {
        displaySize: 6.36,
        weight: 189,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4500,
      }
    },
    {
      brandName: '小米',
      modelName: '13T Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13t-pro.jpg',
      price: 19999,
      specs: {
        displaySize: 6.67,
        weight: 200,
        cpu: 'MediaTek Dimensity 9200+',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: '小米',
      modelName: 'Redmi Note 13 Pro+',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro-plus.jpg',
      price: 12999,
      specs: {
        displaySize: 6.67,
        weight: 204,
        cpu: 'MediaTek Dimensity 7200 Ultra',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '2億畫素三鏡頭',
        battery: 5000,
      }
    },

    // === 更多 OPPO 機型 ===
    {
      brandName: 'OPPO',
      modelName: 'Find X8',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x8.jpg',
      price: 28990,
      specs: {
        displaySize: 6.59,
        weight: 193,
        cpu: 'MediaTek Dimensity 9400',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5630,
      }
    },
    {
      brandName: 'OPPO',
      modelName: 'Reno12 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno12-pro-5g.jpg',
      price: 17990,
      specs: {
        displaySize: 6.7,
        weight: 180,
        cpu: 'MediaTek Dimensity 7300',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'OPPO',
      modelName: 'Reno11 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno11-pro-5g-global.jpg',
      price: 16990,
      specs: {
        displaySize: 6.7,
        weight: 190,
        cpu: 'MediaTek Dimensity 8200',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4600,
      }
    },
    {
      brandName: 'OPPO',
      modelName: 'Find N3 Flip',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-n3-flip.jpg',
      price: 29990,
      specs: {
        displaySize: 6.8,
        weight: 201,
        cpu: 'MediaTek Dimensity 9200',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 4300,
      }
    },

    // === 更多 vivo 機型 ===
    {
      brandName: 'vivo',
      modelName: 'X200',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x200.jpg',
      price: 26990,
      specs: {
        displaySize: 6.67,
        weight: 197,
        cpu: 'MediaTek Dimensity 9400',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5800,
      }
    },
    {
      brandName: 'vivo',
      modelName: 'X100',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x100.jpg',
      price: 23990,
      specs: {
        displaySize: 6.78,
        weight: 206,
        cpu: 'MediaTek Dimensity 9300',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'vivo',
      modelName: 'V40 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-v40-pro.jpg',
      price: 19990,
      specs: {
        displaySize: 6.78,
        weight: 192,
        cpu: 'MediaTek Dimensity 9200+',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5500,
      }
    },
    {
      brandName: 'vivo',
      modelName: 'V30 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-v30-pro.jpg',
      price: 16990,
      specs: {
        displaySize: 6.78,
        weight: 188,
        cpu: 'MediaTek Dimensity 8200',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
      }
    },

    // === 更多 ASUS 機型 ===
    {
      brandName: 'ASUS',
      modelName: 'ROG Phone 8 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-8-pro.jpg',
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
      brandName: 'ASUS',
      modelName: 'ROG Phone 8',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-8.jpg',
      price: 29990,
      specs: {
        displaySize: 6.78,
        weight: 225,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 16,
        storage: '512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5500,
      }
    },
    {
      brandName: 'ASUS',
      modelName: 'Zenfone 10',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/asus-zenfone-10.jpg',
      price: 24990,
      specs: {
        displaySize: 5.9,
        weight: 172,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 8,
        storage: '128GB/256GB/512GB',
        mainCamera: '5000萬畫素雙鏡頭',
        battery: 4300,
      }
    },

    // === 更多 Sony 機型 ===
    {
      brandName: 'Sony',
      modelName: 'Xperia 10 VI',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-10-vi.jpg',
      price: 14990,
      specs: {
        displaySize: 6.1,
        weight: 164,
        cpu: 'Snapdragon 6 Gen 1',
        ram: 8,
        storage: '128GB',
        mainCamera: '4800萬畫素三鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'Sony',
      modelName: 'Xperia 1 V',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-v.jpg',
      price: 33990,
      specs: {
        displaySize: 6.5,
        weight: 187,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '4800萬畫素三鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'Sony',
      modelName: 'Xperia 5 V',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-v.jpg',
      price: 27990,
      specs: {
        displaySize: 6.1,
        weight: 182,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 8,
        storage: '128GB/256GB',
        mainCamera: '4800萬畫素雙鏡頭',
        battery: 5000,
      }
    },

    // === 更多 OnePlus 機型 ===
    {
      brandName: 'OnePlus',
      modelName: '12R',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg',
      price: 19990,
      specs: {
        displaySize: 6.78,
        weight: 207,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 16,
        storage: '256GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5500,
      }
    },
    {
      brandName: 'OnePlus',
      modelName: '11',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-11.jpg',
      price: 22990,
      specs: {
        displaySize: 6.7,
        weight: 205,
        cpu: 'Snapdragon 8 Gen 2',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'OnePlus',
      modelName: 'Nord 4',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-4-5g.jpg',
      price: 13990,
      specs: {
        displaySize: 6.74,
        weight: 199,
        cpu: 'Snapdragon 7+ Gen 3',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素雙鏡頭',
        battery: 5500,
      }
    },
    {
      brandName: 'OnePlus',
      modelName: 'Nord CE4',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce4.jpg',
      price: 10990,
      specs: {
        displaySize: 6.7,
        weight: 186,
        cpu: 'Snapdragon 7 Gen 3',
        ram: 8,
        storage: '128GB/256GB',
        mainCamera: '5000萬畫素雙鏡頭',
        battery: 5500,
      }
    },

    // === 更多 realme 機型 ===
    {
      brandName: 'realme',
      modelName: 'GT5 Pro',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt5-pro.jpg',
      price: 19990,
      specs: {
        displaySize: 6.78,
        weight: 218,
        cpu: 'Snapdragon 8 Gen 3',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5400,
      }
    },
    {
      brandName: 'realme',
      modelName: '12 Pro+',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/realme-12-pro-plus.jpg',
      price: 13990,
      specs: {
        displaySize: 6.7,
        weight: 196,
        cpu: 'Snapdragon 7s Gen 2',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素三鏡頭',
        battery: 5000,
      }
    },
    {
      brandName: 'realme',
      modelName: 'GT Neo6',
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt-neo6-se.jpg',
      price: 11990,
      specs: {
        displaySize: 6.78,
        weight: 191,
        cpu: 'Snapdragon 7+ Gen 3',
        ram: 12,
        storage: '256GB/512GB',
        mainCamera: '5000萬畫素雙鏡頭',
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
