/**
 * 部署設置腳本
 * 用於在 Neon 線上資料庫執行所有必要的 migration
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// 載入環境變數
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function deploySetup() {
  console.log('🚀 開始部署設置...\n');

  try {
    // 1. 建立基礎資料表（brands, phones, reviews）
    console.log('📊 步驟 1/5: 建立基礎資料表...');

    await sql`
      CREATE TABLE IF NOT EXISTS brands (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        logo_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('  ✓ brands 資料表已建立');

    await sql`
      CREATE TABLE IF NOT EXISTS phones (
        id SERIAL PRIMARY KEY,
        brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
        model_name VARCHAR(200) NOT NULL,
        release_date DATE,
        official_price INTEGER,
        our_price INTEGER,
        display_size DECIMAL(3,1),
        resolution VARCHAR(50),
        weight INTEGER,
        cpu VARCHAR(200),
        ram INTEGER,
        storage VARCHAR(100),
        main_camera VARCHAR(200),
        front_camera VARCHAR(200),
        battery INTEGER,
        os VARCHAR(100),
        image_url VARCHAR(500),
        popularity_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('  ✓ phones 資料表已建立');

    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        phone_id INTEGER REFERENCES phones(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        title VARCHAR(300),
        url VARCHAR(500) NOT NULL,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('  ✓ reviews 資料表已建立');

    // 建立索引
    await sql`CREATE INDEX IF NOT EXISTS idx_phones_brand_id ON phones(brand_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_phones_popularity ON phones(popularity_score DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_phone_id ON reviews(phone_id)`;
    console.log('  ✓ 基礎索引已建立');

    // 2. 建立認證資料表
    console.log('\n🔐 步驟 2/5: 建立認證資料表...');

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        "emailVerified" TIMESTAMPTZ,
        image TEXT,
        password TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('  ✓ users 資料表已建立');

    await sql`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    console.log('  ✓ accounts 資料表已建立');

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL
      )
    `;
    console.log('  ✓ sessions 資料表已建立');

    await sql`
      CREATE TABLE IF NOT EXISTS verification_token (
        identifier TEXT NOT NULL,
        token TEXT NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      )
    `;
    console.log('  ✓ verification_token 資料表已建立');

    // 建立認證索引
    await sql`CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts("userId")`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions("userId")`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions("sessionToken")`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    console.log('  ✓ 認證索引已建立');

    // 3. 建立購物車資料表
    console.log('\n🛒 步驟 3/5: 建立購物車資料表...');

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
    console.log('  ✓ cart_items 資料表已建立');

    await sql`CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cart_items_phone_id ON cart_items(phone_id)`;
    console.log('  ✓ 購物車索引已建立');

    // 4. 建立訂單資料表
    console.log('\n📦 步驟 4/5: 建立訂單資料表...');

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
    console.log('  ✓ orders 資料表已建立');

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
    console.log('  ✓ order_items 資料表已建立');

    await sql`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_order_items_phone_id ON order_items(phone_id)`;
    console.log('  ✓ 訂單索引已建立');

    // 5. 插入基本品牌資料
    console.log('\n📱 步驟 5/5: 插入基本品牌資料...');

    await sql`
      INSERT INTO brands (name, logo_url) VALUES
        ('Apple', '/brands/apple.png'),
        ('Samsung', '/brands/samsung.png'),
        ('Google', '/brands/google.png'),
        ('OPPO', '/brands/oppo.png'),
        ('vivo', '/brands/vivo.png'),
        ('小米', '/brands/xiaomi.png'),
        ('realme', '/brands/realme.png'),
        ('Sony', '/brands/sony.png'),
        ('HTC', '/brands/htc.png'),
        ('ASUS', '/brands/asus.png')
      ON CONFLICT (name) DO NOTHING
    `;
    console.log('  ✓ 品牌資料已插入');

    console.log('\n✅ 部署設置完成！');
    console.log('\n下一步：');
    console.log('1. 如需匯入手機資料，請執行：npm run scraper');
    console.log('2. 設定 Vercel 環境變數：DATABASE_URL, AUTH_SECRET');
    console.log('3. 部署到 Vercel：git push');

  } catch (error) {
    console.error('\n❌ 部署設置失敗:', error);
    process.exit(1);
  }
}

deploySetup();
