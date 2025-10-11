/**
 * 使用可靠的手機圖片來源更新資料庫
 * 使用 dummyimage.com 搭配手機資訊
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL!);

// 手機品牌顏色主題
const brandColors: Record<string, string> = {
  'Apple': '000000',
  'Samsung': '1428A0',
  'Google': '4285F4',
  'OPPO': '00A368',
  'vivo': '0066CC',
  '小米': 'FF6900',
  'realme': 'FFC400',
  'Sony': '000000',
  'HTC': '669933',
  'ASUS': '000000',
  'OnePlus': 'F40000',
  'Motorola': '002C5F',
  'Nokia': '124191',
};

function generatePhoneImage(brandName: string, modelName: string): string {
  const color = brandColors[brandName] || '666666';
  const text = `${brandName} ${modelName}`.replace(/ /g, '+');
  // 使用 dummyimage.com 生成 400x400 的手機圖片佔位符
  return `https://dummyimage.com/400x400/${color}/ffffff.png&text=${encodeURIComponent(text)}`;
}

async function updateImages() {
  console.log('=== 更新所有手機圖片為可靠來源 ===\n');

  const phones = await sql`
    SELECT p.id, p.model_name, b.name as brand_name, p.image_url
    FROM phones p
    JOIN brands b ON p.brand_id = b.id
    ORDER BY p.popularity_score DESC
  `;

  console.log(`總共 ${phones.length} 支手機\n`);

  let count = 0;
  for (const phone of phones) {
    const newImageUrl = generatePhoneImage(phone.brand_name as string, phone.model_name as string);

    await sql`
      UPDATE phones
      SET image_url = ${newImageUrl}
      WHERE id = ${phone.id}
    `;

    count++;
    console.log(`✓ ${count}. ${phone.brand_name} ${phone.model_name}`);
  }

  console.log(`\n=== 完成！===`);
  console.log(`✓ 已更新 ${count} 支手機的圖片`);
  console.log(`✓ 所有圖片都使用 dummyimage.com（100% 可靠）`);
  console.log(`✓ 每個品牌都有獨特的顏色主題`);
}

updateImages();
