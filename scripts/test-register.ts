/**
 * 測試註冊 API
 */

async function testRegister() {
  console.log('=== 測試註冊 API ===\n');

  const testUser = {
    name: "測試使用者",
    email: `test${Date.now()}@example.com`,
    password: "test1234"
  };

  console.log('測試資料:', testUser);
  console.log('\n發送請求到 http://localhost:3000/api/auth/register ...\n');

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Data:', data);

    if (response.ok) {
      console.log('\n✅ 註冊成功！');
    } else {
      console.log('\n❌ 註冊失敗:', data.error);
    }
  } catch (error) {
    console.error('\n❌ 請求失敗:', error);
    console.log('\n提示：請確認開發伺服器正在運行 (npm run dev)');
  }
}

testRegister();
