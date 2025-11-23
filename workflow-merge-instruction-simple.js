// ========================================
// 🔴 需要您替换的部分用 ⚠️⚠️⚠️ 标记
// ========================================

// 获取所有数据项
// ⚠️⚠️⚠️ 替换1：节点名称（当前是 'The Cat Cat Journal'）
const allItems = $('⚠️⚠️⚠️ 替换为您的节点名称 ⚠️⚠️⚠️').all();
const count = allItems.length;

// 获取第一项数据
const firstItem = allItems[0].json;

// 提取竞争对手名称
// ⚠️⚠️⚠️ 替换2：字段名（检查您的数据，可能是 page_name 或其他）
const competitorName = firstItem.⚠️⚠️⚠️字段名⚠️⚠️⚠️ || '未知竞争对手';

// 提取爬取时间
// ⚠️⚠️⚠️ 替换3：时间字段名（检查您的数据，可能是 crawlDate、createdAt 等）
const rawDate = firstItem.⚠️⚠️⚠️时间字段名⚠️⚠️⚠️;

// 格式化时间
let crawlDate = '未知时间';
if (rawDate) {
  const dateObj = new Date(rawDate);
  crawlDate = dateObj.toISOString().split('T')[0]; // 格式: YYYY-MM-DD
}

// 组装消息
const text = `【n8n 自《${competitorName}》智能化推荐】
📊 处理数量：${count} 篇
📅 爬取时间：${crawlDate}
📂 已上传 Google Drive
📊 已记录 Google Sheets
✅ 统计完成`;

// 返回结果
return [{ json: { text } }];
