# 部署指南

本文件說明如何將專案部署到 Vercel 和 Neon。

## 前置準備

1. ✅ Neon 帳號（已有資料庫連線字串）
2. ✅ Vercel 帳號
3. ✅ GitHub repository（已連結）

## 步驟 1：設置 Neon 線上資料庫

### 1.1 執行資料庫 Migration

在本機執行以下指令來設置線上資料庫結構：

```bash
npm run deploy:setup
```

這個指令會：
- 建立所有必要的資料表（brands, phones, reviews, users, accounts, sessions, cart_items, orders, order_items）
- 建立所有索引
- 插入基本品牌資料

### 1.2 匯入手機資料（可選）

如果需要匯入測試用手機資料：

```bash
npm run scraper
```

或使用完整爬蟲：

```bash
npm run scraper:full
```

## 步驟 2：設定 Vercel 環境變數

前往 Vercel 專案設定 → Environment Variables，新增以下變數：

### Production Environment

1. **DATABASE_URL**
   - 值：你的 Neon 資料庫連線字串
   - 格式：`postgresql://[user]:[password]@[host]/[database]?sslmode=require`

2. **AUTH_SECRET**
   - 值：隨機生成的密鑰
   - 產生方式：在終端機執行 `openssl rand -base64 32`

3. **NEXTAUTH_URL**（可選）
   - 值：你的正式網域，例如 `https://your-domain.vercel.app`
   - 如果不設定，Next-Auth 會自動偵測

### Preview & Development Environments

可以使用相同的環境變數值，或者：
- Preview：使用相同的生產資料庫（建議使用獨立的 Preview 資料庫）
- Development：使用本機的 `.env.local` 設定

## 步驟 3：部署到 Vercel

### 3.1 透過 GitHub 自動部署

1. 提交所有變更到 GitHub：
   ```bash
   git add .
   git commit -m "完成訂單管理與帳戶功能"
   git push origin features/users
   ```

2. 在 Vercel Dashboard 會自動觸發部署

3. 部署完成後，前往專案 URL 測試功能

### 3.2 手動部署（可選）

如果需要手動觸發部署：

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入 Vercel
vercel login

# 部署
vercel --prod
```

## 步驟 4：驗證部署

部署完成後，測試以下功能：

### 4.1 基本功能
- [ ] 首頁顯示手機列表
- [ ] 品牌篩選功能
- [ ] 手機詳細頁

### 4.2 認證功能
- [ ] 註冊新帳號
- [ ] 登入/登出
- [ ] 修改密碼

### 4.3 購物車功能
- [ ] 加入商品到購物車
- [ ] 查看購物車
- [ ] 修改商品數量
- [ ] 刪除商品

### 4.4 結帳功能
- [ ] 填寫收件資訊
- [ ] 使用測試信用卡資料
- [ ] 完成訂單
- [ ] 查看訂單確認頁

### 4.5 訂單管理
- [ ] 查看訂單列表
- [ ] 查看訂單詳情
- [ ] 取消訂單
- [ ] 查看物流追蹤

## 常見問題

### Q1: 部署後資料庫連線失敗

**A:** 檢查以下項目：
- Vercel 環境變數中的 `DATABASE_URL` 是否正確
- Neon 資料庫是否允許外部連線
- 連線字串是否包含 `?sslmode=require`

### Q2: 登入後出現錯誤

**A:** 確認：
- `AUTH_SECRET` 環境變數已設定
- 資料庫中的認證資料表已建立（執行 `npm run deploy:setup`）

### Q3: 圖片無法顯示

**A:** 檢查：
- `next.config.ts` 中的 `remotePatterns` 設定
- 圖片 URL 是否有效
- Vercel 是否有限制外部圖片來源

### Q4: 購物車或訂單功能異常

**A:** 確認：
- 所有資料表都已建立（執行 `npm run deploy:setup`）
- 外鍵關聯正確
- 使用者已登入

## 資料庫維護

### 備份資料庫

可以使用 `pg_dump` 備份 Neon 資料庫：

```bash
pg_dump $DATABASE_URL > backup.sql
```

### 還原資料庫

```bash
psql $DATABASE_URL < backup.sql
```

### 檢視資料庫狀態

登入 Neon Console 可以：
- 查看連線數
- 監控查詢效能
- 管理資料庫備份

## 效能優化建議

1. **圖片優化**：考慮使用 Next.js `<Image>` 元件
2. **快取策略**：設定適當的 `revalidate` 時間
3. **資料庫索引**：已包含在 migration 中
4. **CDN**：Vercel 自動提供全球 CDN

## 監控與日誌

- **Vercel Analytics**：追蹤頁面效能
- **Vercel Logs**：查看應用程式日誌
- **Neon Monitoring**：監控資料庫效能

## 更新與維護

### 更新程式碼

```bash
git pull
git add .
git commit -m "更新說明"
git push
```

Vercel 會自動重新部署。

### 更新資料庫結構

如果需要修改資料庫結構：

1. 建立新的 migration script
2. 在本機測試
3. 在線上資料庫執行
4. 部署新版本程式碼

## 技術支援

- **Next.js 文件**：https://nextjs.org/docs
- **Vercel 文件**：https://vercel.com/docs
- **Neon 文件**：https://neon.tech/docs
- **Auth.js 文件**：https://authjs.dev
