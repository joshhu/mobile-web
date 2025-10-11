# MobileWeb - 台灣手機電商平台

提供台灣市面上所有手機的產品資料，包括規格、價格、圖片及網路評測。

## 技術堆疊

- **前端框架**: Next.js 15.5 (App Router)
- **UI 框架**: Tailwind CSS 4
- **資料庫**: Neon (Serverless Postgres)
- **部署平台**: Vercel
- **開發語言**: TypeScript

## 快速開始

### 1. 環境設定

複製環境變數範本並填入你的 Neon 資料庫連線字串：

```bash
cp .env.local.example .env.local
```

編輯 `.env.local` 並填入你的資料庫連線字串：

```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 建立資料庫

連線到你的 Neon 資料庫，執行 `lib/schema.sql` 檔案建立所需的資料表。

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 專案結構

```
app/
├── layout.tsx           # 全域佈局
├── page.tsx             # 首頁（熱門手機 Top 20）
├── brand/[brandName]/   # 品牌頁面
└── phone/[phoneId]/     # 手機詳細頁
lib/
├── db.ts                # Neon 資料庫連線
└── schema.sql           # 資料庫結構定義
```

## 功能特色

- 🏠 **首頁**：顯示本月最熱門手機前 20 名
- 📱 **品牌頁面**：列出該品牌所有手機型號
- 📊 **手機詳細頁**：完整規格、價格對比、網路評測連結

## 開發指令

```bash
npm run dev    # 開發模式
npm run build  # 建置專案
npm start      # 啟動生產環境
npm run lint   # 執行 ESLint
```
