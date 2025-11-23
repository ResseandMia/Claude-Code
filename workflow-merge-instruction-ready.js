// ========================================
// ✅ 可直接使用的版本（基于截图数据）
// ========================================

// 1. 获取所有数据项
// 🔴 请将 'The Cat Cat Journal' 替换为您在工作流中的实际节点名称
const allItems = $('The Cat Cat Journal').all();
const count = allItems.length;

// 2. 获取第一项数据
const firstItem = allItems[0].json;

// 3. 提取竞争对手名称
// 根据截图，使用 page_name 字段
// 🔴 如果字段名不同，请替换 'page_name'
const competitorName = firstItem.page_name || '未知竞争对手';

// 4. 提取爬取时间
// 🔴 请根据您的实际数据选择正确的时间字段：
// 选项1: crawlDate
// 选项2: createdAt
// 选项3: updated_at
// 选项4: timestamp
// 下面列出了多个可能的字段，会自动选择第一个有值的
const rawDate = firstItem.crawlDate
  || firstItem.createdAt
  || firstItem.updated_at
  || firstItem.timestamp
  || firstItem.created_time
  || null;

// 5. 格式化时间
let crawlDate = '未知时间';
if (rawDate) {
  try {
    const dateObj = new Date(rawDate);
    // 格式化为 YYYY-MM-DD
    crawlDate = dateObj.toISOString().split('T')[0];
  } catch (e) {
    // 如果转换失败，直接使用原始值
    crawlDate = String(rawDate);
  }
}

// 6. 组装飞书消息
const text = `【n8n 自《${competitorName}》智能化推荐】
📊 处理数量：${count} 篇
📅 爬取时间：${crawlDate}
📂 已上传 Google Drive
📊 已记录 Google Sheets
✅ 统计完成`;

// 7. 返回结果
return [{ json: { text } }];


// ========================================
// 🔍 调试版本（如果上面的不工作，用这个）
// ========================================
// 取消下面注释，查看完整数据结构：
/*
console.log('=== 数据结构调试 ===');
console.log('所有字段:', Object.keys(firstItem));
console.log('page_name:', firstItem.page_name);
console.log('完整数据:', JSON.stringify(firstItem, null, 2));
return [{ json: { text: '查看日志了解数据结构' } }];
*/
