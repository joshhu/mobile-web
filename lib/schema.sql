-- 品牌資料表
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 手機資料表
CREATE TABLE IF NOT EXISTS phones (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
  model_name VARCHAR(200) NOT NULL,
  release_date DATE,
  official_price INTEGER,
  our_price INTEGER,
  -- 規格欄位
  display_size DECIMAL(3,1),  -- 螢幕尺寸（吋）
  resolution VARCHAR(50),      -- 解析度
  weight INTEGER,              -- 重量（克）
  cpu VARCHAR(200),            -- CPU
  ram INTEGER,                 -- RAM（GB）
  storage VARCHAR(100),        -- 儲存容量
  main_camera VARCHAR(200),    -- 主相機
  front_camera VARCHAR(200),   -- 前相機
  battery INTEGER,             -- 電池容量（mAh）
  os VARCHAR(100),             -- 作業系統
  -- 其他欄位
  image_url VARCHAR(500),      -- 產品圖片
  popularity_score INTEGER DEFAULT 0,  -- 熱門度分數
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 評測連結資料表
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  phone_id INTEGER REFERENCES phones(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,  -- 'youtube', 'facebook', 'instagram'
  title VARCHAR(300),
  url VARCHAR(500) NOT NULL,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_phones_brand_id ON phones(brand_id);
CREATE INDEX IF NOT EXISTS idx_phones_popularity ON phones(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_phone_id ON reviews(phone_id);

-- 插入一些範例品牌資料
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
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- Auth.js / NextAuth 認證資料表
-- ========================================

-- 使用者認證資料表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  password TEXT,  -- 用於 email/password 登入（bcrypt 加密）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OAuth 帳號連結
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
);

-- Session 管理
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

-- Email 驗證 token
CREATE TABLE IF NOT EXISTS verification_token (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 建立認證相關索引
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions("sessionToken");
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ========================================
-- 購物車資料表
-- ========================================

-- 購物車項目
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone_id INTEGER NOT NULL REFERENCES phones(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, phone_id)  -- 每個使用者對每支手機只能有一個購物車項目
);

-- 建立購物車相關索引
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_phone_id ON cart_items(phone_id);
