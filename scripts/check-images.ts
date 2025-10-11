import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL!);

async function checkImages() {
  const phones = await sql`
    SELECT p.id, p.model_name, b.name as brand_name, p.image_url
    FROM phones p
    JOIN brands b ON p.brand_id = b.id
    ORDER BY p.popularity_score DESC
    LIMIT 50
  `;

  console.log('=== 檢查前 50 支手機的圖片 URL ===\n');
  
  let withImage = 0;
  let withoutImage = 0;
  const brokenUrls: any[] = [];

  for (const phone of phones) {
    if (phone.image_url) {
      withImage++;
      console.log(`✓ ${phone.brand_name} ${phone.model_name}`);
      console.log(`  ${phone.image_url}`);
    } else {
      withoutImage++;
      brokenUrls.push(phone);
      console.log(`✗ ${phone.brand_name} ${phone.model_name} - 無圖片`);
    }
  }

  console.log(`\n統計:`);
  console.log(`有圖片: ${withImage}`);
  console.log(`無圖片: ${withoutImage}`);
  
  if (brokenUrls.length > 0) {
    console.log('\n需要修復的手機:');
    brokenUrls.forEach(p => console.log(`  - ${p.brand_name} ${p.model_name} (ID: ${p.id})`));
  }
}

checkImages();
