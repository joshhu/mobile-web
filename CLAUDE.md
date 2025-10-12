# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個台灣手機電商平台，使用 Next.js 15 (App Router) 建構，提供手機產品資訊、規格比較與價格查詢。

## 技術堆疊

- **前端**: Next.js 15.5 (App Router) + React 19 + TypeScript
- **樣式**: Tailwind CSS 4
- **資料庫**: Neon (Serverless PostgreSQL)
- **部署**: Vercel
- **開發工具**: Turbopack (Next.js 編譯器)

## 常用指令

### 開發與建置
```bash
npm run dev          # 啟動開發伺服器（使用 Turbopack）
npm run build        # 建置專案（使用 Turbopack）
npm start            # 啟動生產環境
npm run lint         # 執行 ESLint 檢查
```

### 資料爬蟲與管理
```bash
npm run scraper      # 執行基本爬蟲（插入測試資料）
npm run scraper:full # 執行完整爬蟲
npm run verify       # 驗證資料庫資料完整性
```

## 資料庫架構

### 環境設定
- 資料庫連線字串存放在 `.env.local` 檔案中的 `DATABASE_URL`
- 必須先執行 `lib/schema.sql` 建立資料表結構

### 資料表結構
1. **brands** - 品牌資料（Apple、Samsung、小米等）
2. **phones** - 手機資料（型號、規格、價格、圖片）
3. **reviews** - 評測連結（YouTube、Facebook、Instagram）

### 資料庫連線
- 使用 `@neondatabase/serverless` 套件
- 連線物件位於 `lib/db.ts`，匯出為 `sql` 函數
- 使用 SQL template literals 語法（例如：`sql\`SELECT * FROM phones\``）

## 架構說明

### App Router 結構
```
app/
├── layout.tsx              # 全域佈局（含 metadata）
├── page.tsx                # 首頁（所有手機列表，分頁顯示）
├── brand/[brandName]/      # 動態路由：品牌頁面
│   └── page.tsx            # 顯示特定品牌所有手機
└── phone/[phoneId]/        # 動態路由：手機詳細頁
    └── page.tsx            # 顯示手機完整規格與評測
```

### 元件
- `components/Header.tsx` - 全域頁首（導航列）
- 所有頁面都是 Server Components，直接在元件內查詢資料庫

### 資料爬蟲
- `scripts/scraper.ts` - 基本爬蟲，包含預設測試資料
- `scripts/scraper-full.ts` - 完整爬蟲
- 其他 scripts/ 目錄下的工具腳本用於圖片驗證、資料修復等

## 開發注意事項

### 資料庫查詢模式
- 所有頁面都使用 Server Components
- 直接在元件內使用 `sql` template literals 查詢
- 查詢錯誤會被 try-catch 捕捉並返回空陣列

### 分頁功能
- 首頁使用 `searchParams` 接收頁碼參數
- 每頁顯示 40 支手機（`PHONES_PER_PAGE` 常數）
- 使用 SQL `LIMIT` 和 `OFFSET` 實作分頁

### 圖片處理
- 手機圖片儲存在 `phones.image_url` 欄位
- 使用 `object-contain` 保持圖片比例
- 若無圖片則顯示灰色佔位區塊

### 熱門度排序
- 使用 `popularity_score` 欄位排序
- 首頁依熱門度降序顯示手機

## 環境變數

必要的環境變數（存放於 `.env.local`）：
- `DATABASE_URL` - Neon PostgreSQL 連線字串（格式：`postgresql://[user]:[password]@[host]/[database]?sslmode=require`）
