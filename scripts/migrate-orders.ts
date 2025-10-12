import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// 載入環境變數
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function migrateOrders() {
  console.log('開始建立訂單資料表...');

  try {
    // 建立訂單主檔
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        total_amount INTEGER NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
        recipient_name VARCHAR(100) NOT NULL,
        recipient_phone VARCHAR(20) NOT NULL,
        shipping_address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP,
        shipped_at TIMESTAMP,
        delivered_at TIMESTAMP
      )
    `;
    console.log('✓ orders 資料表已建立');

    // 建立訂單明細
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        phone_id INTEGER NOT NULL REFERENCES phones(id),
        phone_name VARCHAR(200) NOT NULL,
        brand_name VARCHAR(100) NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        subtotal INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ order_items 資料表已建立');

    // 建立索引
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_order_items_phone_id ON order_items(phone_id)`;
    console.log('✓ 索引已建立');

    console.log('\n訂單資料表 migration 完成！');
  } catch (error) {
    console.error('Migration 失敗:', error);
    process.exit(1);
  }
}

migrateOrders();
