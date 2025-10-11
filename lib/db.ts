// 資料庫連線設定
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 環境變數未設定');
}

// Neon Postgres 客戶端
export const sql = neon(process.env.DATABASE_URL);
