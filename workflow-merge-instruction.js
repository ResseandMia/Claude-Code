// ===== 🔴 重要：需要替换的部分已用【替换】标记 =====

// 1️⃣ 从合并节点获取所有数据项
// 【替换】：将 'The Cat Cat Journal' 替换为您的实际节点名称
const allItems = $('【替换：您的节点名称】').all();
const count = allItems.length;

// 2️⃣ 提取第一个数据项
const firstItem = allItems[0].json;

// 3️⃣ 提取竞争对手名称
// 【替换】：根据实际数据结构选择字段名
// 可选字段：page_name, name, competitor_name, profile_name 等
let competitorName = firstItem.page_name
  || firstItem.name
  || firstItem.competitor_name
  || '未知竞争对手';

// 4️⃣ 提取爬取时间
// 【替换】：根据实际数据结构选择时间字段
// 可选字段：crawlDate, createdAt, timestamp, date, updated_at 等
let rawDate = firstItem.crawlDate
  || firstItem.createdAt
  || firstItem.timestamp
  || firstItem.date
  || firstItem.updated_at;

// 格式化时间
let crawlDate = '未知时间';
if (rawDate) {
  try {
    const dateObj = new Date(rawDate);
    // 格式化为 YYYY-MM-DD 或您需要的格式
    crawlDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    // 或使用本地化格式：
    // crawlDate = dateObj.toLocaleDateString('zh-CN');
  } catch (e) {
    crawlDate = String(rawDate);
  }
}

// 5️⃣ 组装飞书消息
// 【替换】：根据需要修改消息格式
let text = `【n8n 自《${competitorName}》智能化推荐】
📊 处理数量：${count} 篇
📅 爬取时间：${crawlDate}
📂 已上传 Google Drive
📊 已记录 Google Sheets
✅ 统计完成`;

// 6️⃣ 返回结果
return [{ json: { text } }];


// ===== 📝 使用说明 =====
//
// 步骤 1：确认节点名称
// - 在截图中，您的节点名称显示为 "The Cat Cat Journal"
// - 将第 4 行的【替换：您的节点名称】改为实际名称
//
// 步骤 2：确认竞争对手字段名
// - 检查输入数据中包含竞争对手名称的字段
// - 常见字段名：page_name, name, competitor_name
// - 修改第 14-17 行的字段名
//
// 步骤 3：确认时间字段名
// - 检查输入数据中包含爬取时间的字段
// - 常见字段名：crawlDate, createdAt, timestamp
// - 修改第 23-27 行的字段名
//
// 步骤 4：调整时间格式（可选）
// - 第 34 行使用 YYYY-MM-DD 格式
// - 可改为第 36 行的中文格式
//
// ===== 🔍 调试技巧 =====
//
// 如果还是提取不到数据，在代码开头添加：
// console.log('完整数据：', JSON.stringify(firstItem, null, 2));
// 查看完整的数据结构，确认字段名
