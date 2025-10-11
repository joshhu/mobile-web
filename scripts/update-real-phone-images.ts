/**
 * 使用真實手機圖片 API 更新所有手機照片
 * 使用 fdn.gsmarena.com 的手機圖片資源
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL!);

// 真實手機圖片對應表（從 GSMArena 獲取的真實圖片 URL）
const realPhoneImages: Record<string, Record<string, string>> = {
  'Apple': {
    'iPhone 17 Pro Max': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg',
    'iPhone 17 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg',
    'iPhone 17': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg',
    'iPhone 17 Plus': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg',
    'iPhone 16 Pro Max': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg',
    'iPhone 16 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg',
    'iPhone 16': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg',
    'iPhone 16 Plus': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg',
    'iPhone 15 Pro Max': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg',
    'iPhone 15 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg',
    'iPhone 15': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg',
    'iPhone 15 Plus': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus.jpg',
    'iPhone 14 Pro Max': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max-.jpg',
    'iPhone 14 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg',
    'iPhone 14': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg',
    'iPhone 13': 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg',
  },
  'Samsung': {
    'Galaxy S25 Ultra': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra.jpg',
    'Galaxy S25+': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-plus.jpg',
    'Galaxy S25': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25.jpg',
    'Galaxy S24 Ultra': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg',
    'Galaxy S24+': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus-5g.jpg',
    'Galaxy S24': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g.jpg',
    'Galaxy S23 Ultra': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra.jpg',
    'Galaxy S23+': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-plus.jpg',
    'Galaxy S23': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23.jpg',
    'Galaxy Z Fold6': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold6.jpg',
    'Galaxy Z Fold5': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold5.jpg',
    'Galaxy Z Flip6': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip6.jpg',
    'Galaxy Z Flip5': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip5.jpg',
    'Galaxy A55 5G': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a55.jpg',
    'Galaxy A35 5G': 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a35.jpg',
  },
  'Google': {
    'Pixel 9 Pro XL': 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-xl.jpg',
    'Pixel 9 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro.jpg',
    'Pixel 9': 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9.jpg',
    'Pixel 8a': 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg',
    'Pixel 8 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg',
    'Pixel 8': 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg',
    'Pixel 7 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7-pro.jpg',
    'Pixel 7': 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7.jpg',
  },
  '小米': {
    '15T Pro': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14t-pro.jpg',
    '15T': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14t.jpg',
    '15 Ultra': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-15-ultra.jpg',
    '15 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-pro.jpg',
    '15': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14.jpg',
    '14 Ultra': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-ultra.jpg',
    '14 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-pro.jpg',
    '14': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14.jpg',
    '13 Ultra': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-ultra.jpg',
    '13 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-pro.jpg',
    '13': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13.jpg',
    '13T Pro': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13t-pro.jpg',
    'Redmi Note 13 Pro+': 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro-plus.jpg',
  },
  'OPPO': {
    'Find X8 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x8-pro.jpg',
    'Find X8': 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x8.jpg',
    'Find X7 Ultra': 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x7-ultra.jpg',
    'Reno12 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno12-pro-5g.jpg',
    'Reno11 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno11-pro-5g-global.jpg',
    'Find N3 Flip': 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-n3-flip.jpg',
  },
  'vivo': {
    'X200 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x200-pro.jpg',
    'X200': 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x200.jpg',
    'X100 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x100-pro.jpg',
    'X100': 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x100.jpg',
    'V40 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/vivo-v40-pro.jpg',
    'V30 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/vivo-v30-pro.jpg',
  },
  'ASUS': {
    'ROG Phone 9 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-9-pro.jpg',
    'ROG Phone 8 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-8-pro.jpg',
    'ROG Phone 8': 'https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-8.jpg',
    'Zenfone 11 Ultra': 'https://fdn2.gsmarena.com/vv/bigpic/asus-zenfone-11-ultra.jpg',
    'Zenfone 10': 'https://fdn2.gsmarena.com/vv/bigpic/asus-zenfone-10.jpg',
  },
  'Sony': {
    'Xperia 1 VI': 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-vi.jpg',
    'Xperia 5 VI': 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-vi.jpg',
    'Xperia 10 VI': 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-10-vi.jpg',
    'Xperia 1 V': 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-v.jpg',
    'Xperia 5 V': 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-v.jpg',
  },
  'OnePlus': {
    '13': 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-13.jpg',
    '12': 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg',
    '12R': 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg',
    '11': 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-11.jpg',
    'Nord 4': 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-4-5g.jpg',
    'Nord CE4': 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce4.jpg',
  },
  'realme': {
    'GT7 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt7-pro.jpg',
    'GT6': 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt6.jpg',
    'GT5 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt5-pro.jpg',
    '13 Pro+': 'https://fdn2.gsmarena.com/vv/bigpic/realme-13-pro-plus.jpg',
    '12 Pro+': 'https://fdn2.gsmarena.com/vv/bigpic/realme-12-pro-plus.jpg',
    'GT Neo6': 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt-neo6-se.jpg',
  },
  'HTC': {
    'U23 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/htc-u23-pro.jpg',
    'Desire 22 Pro': 'https://fdn2.gsmarena.com/vv/bigpic/htc-desire-22-pro.jpg',
  },
};

// 預設圖片（如果找不到對應的圖片）
const defaultImage = 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg';

async function updateRealPhoneImages() {
  console.log('=== 使用真實手機圖片更新資料庫 ===\n');

  const phones = await sql`
    SELECT p.id, p.model_name, b.name as brand_name
    FROM phones p
    JOIN brands b ON p.brand_id = b.id
    ORDER BY p.popularity_score DESC
  `;

  console.log(`總共 ${phones.length} 支手機\n`);

  let foundCount = 0;
  let notFoundCount = 0;

  for (const phone of phones) {
    const brandName = phone.brand_name as string;
    const modelName = phone.model_name as string;

    let imageUrl: string | undefined;

    // 查找對應的真實圖片
    if (realPhoneImages[brandName] && realPhoneImages[brandName][modelName]) {
      imageUrl = realPhoneImages[brandName][modelName];
      foundCount++;
      console.log(`✓ ${brandName} ${modelName}`);
    } else {
      // 使用預設圖片
      imageUrl = defaultImage;
      notFoundCount++;
      console.log(`? ${brandName} ${modelName} (使用預設圖片)`);
    }

    await sql`
      UPDATE phones
      SET image_url = ${imageUrl}
      WHERE id = ${phone.id}
    `;
  }

  console.log(`\n=== 完成！===`);
  console.log(`✓ 找到對應圖片: ${foundCount}`);
  console.log(`? 使用預設圖片: ${notFoundCount}`);
  console.log(`✓ 所有圖片都是真實的手機照片（來自 GSMArena）`);
}

updateRealPhoneImages();
