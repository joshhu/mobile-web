/**
 * 執行認證資料表 Migration
 * 用途：在現有資料庫中建立 Auth.js 所需的資料表
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// 載入環境變數
config({ path: '.env.local' });

// 檢查環境變數
if (!process.env.DATABASE_URL) {
  throw new Error('請設定 DATABASE_URL 環境變數');
}

const sql = neon(process.env.DATABASE_URL);

async function migrateAuthTables() {
  console.log('=== 執行認證資料表 Migration ===\n');

  try {
    // 測試資料庫連線
    console.log('測試資料庫連線...');
    await sql`SELECT 1`;
    console.log('✓ 資料庫連線成功\n');

    // 直接執行認證相關資料表建立
    console.log('建立認證資料表...\n');

    let successCount = 0;
    let skipCount = 0;

    // 1. 建立 users 資料表
    try {
      console.log('建立資料表: users...');
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255) UNIQUE NOT NULL,
          "emailVerified" TIMESTAMPTZ,
          image TEXT,
          password TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      successCount++;
      console.log('  ✓ 成功\n');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        skipCount++;
        console.log('  ⊘ 已存在，跳過\n');
      } else {
        console.error('  ✗ 失敗:', error.message, '\n');
      }
    }

    // 2. 建立 accounts 資料表
    try {
      console.log('建立資料表: accounts...');
      await sql`
        CREATE TABLE IF NOT EXISTS accounts (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(255) NOT NULL,
          provider VARCHAR(255) NOT NULL,
          "providerAccountId" VARCHAR(255) NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at BIGINT,
          token_type TEXT,
          scope TEXT,
          id_token TEXT,
          session_state TEXT,
          UNIQUE(provider, "providerAccountId")
        )
      `;
      successCount++;
      console.log('  ✓ 成功\n');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        skipCount++;
        console.log('  ⊘ 已存在，跳過\n');
      } else {
        console.error('  ✗ 失敗:', error.message, '\n');
      }
    }

    // 3. 建立 sessions 資料表
    try {
      console.log('建立資料表: sessions...');
      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
          "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires TIMESTAMPTZ NOT NULL
        )
      `;
      successCount++;
      console.log('  ✓ 成功\n');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        skipCount++;
        console.log('  ⊘ 已存在，跳過\n');
      } else {
        console.error('  ✗ 失敗:', error.message, '\n');
      }
    }

    // 4. 建立 verification_token 資料表
    try {
      console.log('建立資料表: verification_token...');
      await sql`
        CREATE TABLE IF NOT EXISTS verification_token (
          identifier TEXT NOT NULL,
          token TEXT NOT NULL,
          expires TIMESTAMPTZ NOT NULL,
          PRIMARY KEY (identifier, token)
        )
      `;
      successCount++;
      console.log('  ✓ 成功\n');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        skipCount++;
        console.log('  ⊘ 已存在，跳過\n');
      } else {
        console.error('  ✗ 失敗:', error.message, '\n');
      }
    }

    // 5. 建立索引
    const indexes = [
      { name: 'idx_accounts_user_id', sql: 'CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts("userId")' },
      { name: 'idx_sessions_user_id', sql: 'CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions("userId")' },
      { name: 'idx_sessions_token', sql: 'CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions("sessionToken")' },
      { name: 'idx_users_email', sql: 'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)' },
    ];

    for (const index of indexes) {
      try {
        console.log(`建立索引: ${index.name}...`);
        await sql.query(index.sql);
        successCount++;
        console.log('  ✓ 成功\n');
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          skipCount++;
          console.log('  ⊘ 已存在，跳過\n');
        } else {
          console.error('  ✗ 失敗:', error.message, '\n');
        }
      }
    }

    console.log('\n=== Migration 完成！===');
    console.log(`成功: ${successCount} 項`);
    console.log(`跳過: ${skipCount} 項`);
    console.log('\n現在可以使用認證功能了！');
    console.log('提示：執行 npm run dev 啟動開發伺服器');

  } catch (error) {
    console.error('執行失敗:', error);
    process.exit(1);
  }
}

// 執行 migration
migrateAuthTables();
