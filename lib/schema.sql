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
