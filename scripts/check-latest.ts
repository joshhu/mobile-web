import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL!);

async function checkLatest() {
  console.log('=== 檢查最新機型 ===\n');
  
  const iphone17 = await sql`
    SELECT model_name FROM phones p
    JOIN brands b ON p.brand_id = b.id
    WHERE b.name = 'Apple' AND model_name LIKE '%17%'
  `;
  
  const xiaomi15 = await sql`
    SELECT model_name FROM phones p
    JOIN brands b ON p.brand_id = b.id
    WHERE b.name = '小米' AND (model_name LIKE '%15%' OR model_name LIKE '%15T%')
  `;
  
  console.log('iPhone 17 系列:');
  iphone17.forEach((p: any) => console.log(`  - ${p.model_name}`));
  
  console.log('\n小米 15/15T 系列:');
  xiaomi15.forEach((p: any) => console.log(`  - ${p.model_name}`));
  
  const total = await sql`SELECT COUNT(*) as count FROM phones`;
  console.log(`\n總手機數: ${total[0].count}`);
}

checkLatest();
