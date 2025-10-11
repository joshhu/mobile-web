/**
 * 修復圖片 URL - 使用可靠的圖片來源
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL!);

// 使用 ui-avatars.com 為每支手機生成唯一的佔位符圖片
function generatePhoneImage(brandName: string, modelName: string): string {
  const text = `${brandName}+${modelName}`.substring(0, 20);
  // 使用漸層色背景的文字圖片
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&size=400&background=random&color=fff&bold=true&format=png`;
}

async function fixImages() {
  console.log('=== 開始修復圖片 URL ===\n');

  const phones = await sql`
    SELECT p.id, p.model_name, b.name as brand_name
    FROM phones p
    JOIN brands b ON p.brand_id = b.id
  `;

  console.log(`總共 ${phones.length} 支手機需要更新圖片\n`);

  let count = 0;
  for (const phone of phones) {
    const imageUrl = generatePhoneImage(phone.brand_name as string, phone.model_name as string);

    await sql`
      UPDATE phones
      SET image_url = ${imageUrl}
      WHERE id = ${phone.id}
    `;

    count++;
    if (count % 10 === 0) {
      console.log(`已更新 ${count}/${phones.length} 支手機...`);
    }
  }

  console.log(`\n✓ 完成！已更新 ${count} 支手機的圖片`);
  console.log('所有手機現在都有獨特的品牌+型號圖片');
}

fixImages();
