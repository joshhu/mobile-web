import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

// 載入環境變數
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// 從環境變數讀取資料庫連線
const sql = neon(process.env.DATABASE_URL!);

// 需要修復的手機清單
const brokenPhones = [
  { id: 189, brand: 'OPPO', model: 'Reno11 Pro' },
  { id: 116, brand: 'OnePlus', model: 'Nord CE4' },
  { id: 95, brand: '小米', model: '13 Pro' },
  { id: 169, brand: 'Samsung', model: 'Galaxy S23 Ultra' },
  { id: 100, brand: 'OPPO', model: 'Reno12 Pro' },
  { id: 64, brand: 'Sony', model: 'Xperia 5 VI' },
  { id: 170, brand: 'Samsung', model: 'Galaxy S23+' },
  { id: 180, brand: 'Google', model: 'Pixel 7' },
  { id: 26, brand: '小米', model: '14 Ultra' },
  { id: 54, brand: '小米', model: '15 Ultra' },
  { id: 4, brand: 'Samsung', model: 'Galaxy S24+' },
  { id: 204, brand: 'OnePlus', model: 'Nord CE4' }
];

// 從手機王 (sogi.com.tw) 搜尋圖片
async function searchSogi(brand: string, model: string): Promise<string | null> {
  try {
    const searchQuery = `${brand} ${model}`.trim();
    console.log(`  🔍 手機王搜尋: ${searchQuery}`);

    // 搜尋頁面
    const searchUrl = `https://www.sogi.com.tw/search?q=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // 找產品頁面連結
    const productLink = $('a[href*="/product/"]').first().attr('href');
    if (!productLink) {
      console.log('  ❌ 手機王：找不到產品頁面');
      return null;
    }

    const fullProductUrl = productLink.startsWith('http')
      ? productLink
      : `https://www.sogi.com.tw${productLink}`;

    // 訪問產品頁面
    const productResponse = await axios.get(fullProductUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $product = cheerio.load(productResponse.data);

    // 找圖片 - 嘗試多種選擇器
    let imageUrl = $product('img.product-img').first().attr('src') ||
                   $product('img[itemprop="image"]').first().attr('src') ||
                   $product('.product-detail img').first().attr('src') ||
                   $product('meta[property="og:image"]').attr('content');

    if (imageUrl) {
      // 確保是完整 URL
      if (!imageUrl.startsWith('http')) {
        imageUrl = `https://www.sogi.com.tw${imageUrl}`;
      }
      console.log(`  ✅ 手機王：找到圖片`);
      return imageUrl;
    }

    console.log('  ❌ 手機王：找不到圖片');
    return null;

  } catch (error) {
    console.log(`  ❌ 手機王錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`);
    return null;
  }
}

// 從 PhoneDB 搜尋圖片
async function searchPhoneDB(brand: string, model: string): Promise<string | null> {
  try {
    const searchQuery = `${brand} ${model}`.trim();
    console.log(`  🔍 PhoneDB 搜尋: ${searchQuery}`);

    // 搜尋頁面
    const searchUrl = `https://phonedb.net/index.php?m=device&s=search&q=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // 找產品圖片
    let imageUrl = $('.device-image img').first().attr('src') ||
                   $('img[alt*="' + model + '"]').first().attr('src') ||
                   $('.search-result img').first().attr('src');

    if (imageUrl) {
      // 確保是完整 URL
      if (!imageUrl.startsWith('http')) {
        imageUrl = `https://phonedb.net${imageUrl}`;
      }
      console.log(`  ✅ PhoneDB：找到圖片`);
      return imageUrl;
    }

    console.log('  ❌ PhoneDB：找不到圖片');
    return null;

  } catch (error) {
    console.log(`  ❌ PhoneDB 錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`);
    return null;
  }
}

// 從傑昇通訊搜尋圖片
async function searchJyes(brand: string, model: string): Promise<string | null> {
  try {
    const searchQuery = `${brand} ${model}`.trim();
    console.log(`  🔍 傑昇通訊搜尋: ${searchQuery}`);

    // 搜尋頁面
    const searchUrl = `https://www.jyes.com.tw/search?keyword=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // 找產品圖片
    let imageUrl = $('.product-img img').first().attr('src') ||
                   $('.item-img img').first().attr('src') ||
                   $('meta[property="og:image"]').attr('content');

    if (imageUrl) {
      // 確保是完整 URL
      if (!imageUrl.startsWith('http')) {
        imageUrl = `https://www.jyes.com.tw${imageUrl}`;
      }
      console.log(`  ✅ 傑昇通訊：找到圖片`);
      return imageUrl;
    }

    console.log('  ❌ 傑昇通訊：找不到圖片');
    return null;

  } catch (error) {
    console.log(`  ❌ 傑昇通訊錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`);
    return null;
  }
}

// 驗證圖片 URL 是否有效
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      validateStatus: (status) => status < 500
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

// 為單支手機尋找圖片
async function findImageForPhone(brand: string, model: string): Promise<string | null> {
  console.log(`\n📱 處理: ${brand} ${model}`);

  // 依序嘗試各個來源
  const sources = [
    { name: '手機王', fn: searchSogi },
    { name: 'PhoneDB', fn: searchPhoneDB },
    { name: '傑昇通訊', fn: searchJyes }
  ];

  for (const source of sources) {
    const imageUrl = await source.fn(brand, model);
    if (imageUrl) {
      // 驗證 URL
      console.log(`  🔄 驗證圖片 URL...`);
      const isValid = await validateImageUrl(imageUrl);
      if (isValid) {
        console.log(`  ✅ 成功！使用 ${source.name} 的圖片`);
        return imageUrl;
      } else {
        console.log(`  ❌ 圖片 URL 無效，繼續嘗試下一個來源`);
      }
    }
  }

  console.log(`  ❌ 所有來源都找不到有效圖片`);
  return null;
}

// 主程式
async function scrapeAllMissingImages() {
  console.log('開始為失效圖片的手機爬取新圖片...\n');
  console.log(`共需處理 ${brokenPhones.length} 支手機\n`);

  const results: { id: number; brand: string; model: string; imageUrl: string | null }[] = [];

  for (const phone of brokenPhones) {
    const imageUrl = await findImageForPhone(phone.brand, phone.model);
    results.push({
      id: phone.id,
      brand: phone.brand,
      model: phone.model,
      imageUrl
    });

    // 稍微延遲避免被封鎖
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // 顯示結果
  console.log('\n\n========== 結果摘要 ==========\n');
  const successful = results.filter(r => r.imageUrl !== null);
  const failed = results.filter(r => r.imageUrl === null);

  console.log(`✅ 成功找到圖片: ${successful.length} 支`);
  console.log(`❌ 未找到圖片: ${failed.length} 支\n`);

  if (successful.length > 0) {
    console.log('成功清單：');
    successful.forEach(r => {
      console.log(`  ${r.brand} ${r.model} (ID: ${r.id})`);
      console.log(`    ${r.imageUrl}\n`);
    });
  }

  if (failed.length > 0) {
    console.log('失敗清單：');
    failed.forEach(r => {
      console.log(`  ${r.brand} ${r.model} (ID: ${r.id})`);
    });
  }

  // 更新資料庫
  if (successful.length > 0) {
    console.log('\n\n正在更新資料庫...');
    for (const result of successful) {
      await sql`
        UPDATE phones
        SET image_url = ${result.imageUrl}
        WHERE id = ${result.id}
      `;
      console.log(`✅ 已更新: ${result.brand} ${result.model}`);
    }
    console.log('\n資料庫更新完成！');
  }
}

scrapeAllMissingImages();
