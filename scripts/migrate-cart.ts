/**
 * 執行購物車資料表 Migration
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('請設定 DATABASE_URL 環境變數');
}

const sql = neon(process.env.DATABASE_URL);

async function migrateCartTable() {
  console.log('=== 執行購物車資料表 Migration ===\n');

  try {
    console.log('測試資料庫連線...');
    await sql`SELECT 1`;
    console.log('✓ 資料庫連線成功\n');

    // 建立 cart_items 資料表
    try {
      console.log('建立資料表: cart_items...');
      await sql`
        CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          phone_id INTEGER NOT NULL REFERENCES phones(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, phone_id)
        )
      `;
      console.log('  ✓ 成功\n');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log('  ⊘ 已存在，跳過\n');
      } else {
        throw error;
      }
    }

    // 建立索引
    const indexes = [
      { name: 'idx_cart_items_user_id', sql: 'CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id)' },
      { name: 'idx_cart_items_phone_id', sql: 'CREATE INDEX IF NOT EXISTS idx_cart_items_phone_id ON cart_items(phone_id)' },
    ];

    for (const index of indexes) {
      try {
        console.log(`建立索引: ${index.name}...`);
        await sql.query(index.sql);
        console.log('  ✓ 成功\n');
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          console.log('  ⊘ 已存在，跳過\n');
        } else {
          throw error;
        }
      }
    }

    console.log('=== Migration 完成！===');
    console.log('\n現在可以使用購物車功能了！');

  } catch (error) {
    console.error('執行失敗:', error);
    process.exit(1);
  }
}

migrateCartTable();
