# 竞争对手广告监控 n8n 工作流

## 📋 工作流概述

这是一个自动化的竞争对手广告监控系统，能够：
- ✅ 每周自动触发2次（周一和周四上午9点）
- ✅ 爬取指定竞争对手的广告数据
- ✅ 自动去重，避免重复存储
- ✅ 将数据保存到 Google Sheets
- ✅ 按规则组织媒体文件到 Google Drive
- ✅ 使用 Claude AI 分析广告趋势
- ✅ 发送精美的HTML邮件报告
- ✅ 完整的错误处理和日志记录

## 🎯 工作流架构

```
触发器 (每周2次)
    ↓
读取竞争对手配置
    ↓
遍历每个竞争对手
    ↓
爬取广告数据
    ↓
解析并验证数据
    ↓
去重检查
    ↓
保存到 Google Sheets
    ↓
下载媒体文件 (图片/视频)
    ↓
上传到 Google Drive (按文件夹组织)
    ↓
汇总统计数据
    ↓
Claude AI 分析
    ↓
发送邮件报告
    ↓
记录执行日志
```

## 📦 前置准备

### 1. n8n 环境
- n8n 版本: 1.0.0 或更高
- 安装方式：Docker、npm 或 n8n Cloud

### 2. 所需凭证

#### Google Sheets OAuth2
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目并启用 Google Sheets API
3. 创建 OAuth2 凭证
4. 在 n8n 中添加 Google Sheets OAuth2 凭证

#### Google Drive OAuth2
1. 在同一个 Google Cloud 项目中启用 Google Drive API
2. 使用相同的 OAuth2 凭证或创建新凭证
3. 在 n8n 中添加 Google Drive OAuth2 凭证

#### Anthropic API
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 创建 API Key
3. 在 n8n 中添加 HTTP 请求凭证，或创建自定义 Anthropic API 凭证

#### SMTP (邮件发送)
1. 使用 Gmail、Outlook 或自定义 SMTP 服务器
2. 配置 SMTP 凭证：
   - Gmail: 需要创建应用专用密码
   - Outlook: 使用账户密码
   - 自定义: 联系邮件服务提供商

### 3. Google Sheets 设置

创建一个新的 Google Sheets 工作簿，包含以下工作表：

#### 工作表1：Competitors（竞争对手配置）
| 竞争对手名称 | 广告库URL | 是否启用 |
|------------|---------|---------|
| 竞品A | https://... | TRUE |
| 竞品B | https://... | TRUE |
| 竞品C | https://... | FALSE |

#### 工作表2：AdsData（广告数据）
| 广告ID | 竞争对手 | 爬取日期 | 标题 | 描述 | 文案 | CTA | 图片数 | 视频数 | 落地页 | 平台 | 格式 | 展示次数 | 互动数 | 开始日期 | 状态 | 图片URLs | 视频URLs |
|-------|---------|---------|-----|------|-----|-----|-------|-------|--------|------|------|---------|--------|---------|------|---------|---------|

#### 工作表3：ExecutionLog（执行日志）
| 执行时间 | 总广告数 | 成功数 | 失败数 | 处理时长 | 状态 |
|---------|---------|-------|--------|---------|------|

### 4. Google Drive 文件夹结构

创建一个主文件夹（例如"广告监控"），然后为每个竞争对手创建子文件夹：

```
广告监控/
├── 竞品A/
│   ├── 图片/
│   │   ├── 2025-01-20/
│   │   └── 2025-01-24/
│   └── 视频/
│       ├── 2025-01-20/
│       └── 2025-01-24/
├── 竞品B/
│   ├── 图片/
│   └── 视频/
└── 竞品C/
    ├── 图片/
    └── 视频/
```

## 🔧 安装和配置

### 1. 导入工作流

1. 登录你的 n8n 实例
2. 点击右上角的 "..." 菜单
3. 选择 "Import from File"
4. 上传 `competitor-ad-monitoring.json` 文件

### 2. 配置参数

#### 更新以下节点的参数：

**读取竞争对手列表节点**
```json
"url": "https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values/Competitors!A2:C"
```
- 替换 `YOUR_SPREADSHEET_ID` 为你的 Google Sheets ID

**保存到Google Sheets节点**
```json
"sheetId": "YOUR_SPREADSHEET_ID",
"range": "AdsData!A:T"
```

**上传图片/视频到Google Drive节点**
```json
"folderId": "YOUR_GOOGLE_DRIVE_FOLDER_ID"
```
- 在 Google Drive 中找到文件夹ID（URL中的部分）

**Claude API分析节点**
- 配置 Anthropic API 凭证
- 选择模型：`claude-3-5-sonnet-20241022`

**发送邮件通知节点**
```json
"fromEmail": "your-email@example.com",
"toEmail": "recipient@example.com"
```

### 3. 配置凭证

为以下节点添加凭证：
- ✅ 读取竞争对手列表（Google OAuth2）
- ✅ 保存到Google Sheets（Google OAuth2）
- ✅ 上传图片到Google Drive（Google Drive OAuth2）
- ✅ 上传视频到Google Drive（Google Drive OAuth2）
- ✅ Claude API分析（Anthropic API）
- ✅ 发送邮件通知（SMTP）
- ✅ 发送错误通知（SMTP）
- ✅ 记录执行日志（Google OAuth2）

### 4. 自定义爬取逻辑

**重要：** 示例工作流中的爬取逻辑是通用的模板，你需要根据实际广告平台调整：

#### 选项A：使用广告平台官方API

如果竞争对手的广告在公开广告库（如 Facebook Ad Library、Google Ads Transparency），可以使用官方API：

**Facebook Ad Library**
```javascript
// 在"爬取广告数据"节点中
{
  "url": "https://graph.facebook.com/v18.0/ads_archive",
  "method": "GET",
  "qs": {
    "access_token": "YOUR_FB_ACCESS_TOKEN",
    "search_terms": "{{ $json.competitorName }}",
    "ad_reached_countries": "US",
    "fields": "id,ad_creative_body,ad_creative_link_caption,ad_snapshot_url,page_name"
  }
}
```

**Google Ads Transparency**
```javascript
// 需要使用自定义爬虫或第三方服务
```

#### 选项B：使用Puppeteer爬取

对于没有API的平台，使用 n8n 的 Puppeteer 节点：

1. 安装 n8n-nodes-puppeteer（如果还没有）
2. 替换"爬取广告数据"节点为 Puppeteer 节点
3. 编写自定义脚本：

```javascript
// Puppeteer 脚本示例
const page = await browser.newPage();
await page.goto($json.adLibraryUrl);

// 等待广告加载
await page.waitForSelector('.ad-item');

// 提取广告数据
const ads = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.ad-item')).map(ad => ({
    title: ad.querySelector('.ad-title')?.textContent,
    description: ad.querySelector('.ad-description')?.textContent,
    imageUrl: ad.querySelector('img')?.src,
    // ... 更多字段
  }));
});

return ads;
```

#### 选项C：使用第三方爬虫服务

集成专业的广告监控API：
- AdSpy
- BigSpy
- PowerAdSpy
- Minea

### 5. 调整解析逻辑

在"解析广告数据"节点中，根据实际HTML结构或API响应调整选择器：

```javascript
// 示例：调整CSS选择器
$('.ad-item').each((index, element) => {
  const ad = {
    // 根据实际结构调整选择器
    adTitle: $(element).find('.your-actual-title-class').text().trim(),
    adDescription: $(element).find('.your-actual-desc-class').text().trim(),
    // ...
  };
});
```

## 🚀 测试和运行

### 测试工作流

1. **手动测试**
   - 点击"定时触发器"节点
   - 点击"Execute Node"
   - 观察每个节点的输出

2. **测试单个竞争对手**
   - 在 Competitors 表中只启用一个竞争对手
   - 运行工作流
   - 检查 Google Sheets 和 Google Drive

3. **检查错误处理**
   - 故意输入错误的URL
   - 确认错误通知邮件发送

### 激活工作流

1. 测试成功后，点击工作流右上角的"Inactive"切换为"Active"
2. 工作流将按计划自动运行（每周一和周四上午9点）

## 📊 数据示例

### Google Sheets 数据格式

```csv
广告ID,竞争对手,爬取日期,标题,描述,文案,CTA,图片数,视频数,落地页,平台,格式,展示次数,互动数,开始日期,状态
ad_123,竞品A,2025-01-20,夏季大促销,全场5折,立即抢购,了解更多,3,0,https://...,Facebook,carousel,10000,500,2025-01-15,active
```

### 邮件报告示例

邮件将包含：
- 📊 数据概览（总广告数、图片/视频比例）
- 🏢 每个竞争对手的明细
- 🤖 Claude AI 的深度分析
- 💡 策略建议

## ⚙️ 高级配置

### 调整触发频率

修改"定时触发器"节点的 cron 表达式：

```javascript
// 每周一、三、五上午9点
"0 9 * * 1,3,5"

// 每天上午10点
"0 10 * * *"

// 每周一上午9点和下午3点
"0 9,15 * * 1"
```

### 添加更多分析维度

在"准备Claude分析数据"节点中添加更多分析提示：

```javascript
const analysisPrompt = `请分析以下竞争对手广告数据：
...

额外分析：
- 按行业分类广告
- 识别季节性趋势
- 对比不同平台的效果
- 预测未来趋势
`;
```

### 集成Slack/Discord通知

添加 Slack 或 Discord 节点替代或补充邮件通知：

```javascript
// Slack 消息格式
{
  "text": "广告监控报告",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*今日爬取摘要*\n总广告数: {{ $json.stats.totalAds }}"
      }
    }
  ]
}
```

### 数据导出和备份

添加定期备份节点：
1. 读取 Google Sheets 全部数据
2. 导出为 CSV
3. 上传到 Google Drive 或其他云存储
4. 设置为每月1号执行

## 🐛 故障排查

### 常见问题

**1. 爬取失败**
- 检查广告库URL是否正确
- 验证网络连接
- 查看目标网站是否有反爬机制
- 考虑使用代理或更换IP

**2. Google Drive 上传失败**
- 检查文件大小（Google Drive单文件最大5TB）
- 验证文件夹权限
- 确认存储配额

**3. Claude API 超时**
- 减少发送的数据量
- 分批处理
- 增加超时时间

**4. 邮件发送失败**
- 检查 SMTP 凭证
- 验证发件人邮箱设置
- 检查收件箱是否满

**5. 重复数据**
- 检查广告ID生成逻辑
- 验证去重节点配置
- 手动清理重复数据

### 调试技巧

1. **启用详细日志**
   - Settings → Log level → Debug

2. **查看节点输出**
   - 点击节点查看输入/输出数据
   - 使用"Run Node"单独测试

3. **使用断点**
   - 添加"Set"节点输出中间数据
   - 在关键节点后添加"Stop and Error"节点

## 📈 性能优化

### 减少执行时间

1. **并行处理**
   - 使用"Split In Batches"并设置合理的批次大小
   - 考虑使用"Execute Workflow"触发子工作流

2. **缓存优化**
   - 缓存竞争对手列表
   - 使用 n8n 的静态数据功能

3. **限流控制**
   - 在爬取节点间添加延迟（Wait节点）
   - 避免触发目标网站的限流机制

### 减少成本

1. **API调用优化**
   - 只在有新数据时调用 Claude API
   - 使用更便宜的模型处理简单任务

2. **存储优化**
   - 压缩图片和视频
   - 定期清理旧数据
   - 使用 Google Drive 的共享配额

## 🔒 安全建议

1. **凭证管理**
   - 使用环境变量存储敏感信息
   - 定期轮换 API 密钥
   - 限制 OAuth2 权限范围

2. **数据隐私**
   - 不要存储个人身份信息
   - 遵守 GDPR 和其他隐私法规
   - 定期审计数据访问日志

3. **访问控制**
   - 限制 n8n 工作流的访问权限
   - 使用强密码和2FA
   - 定期审查用户权限

## 📚 扩展功能建议

1. **竞品趋势分析**
   - 对比历史数据
   - 生成趋势图表
   - 预测未来走向

2. **自动化响应**
   - 发现优秀广告自动创建任务
   - 触发内部通知给创意团队
   - 自动生成竞品报告PPT

3. **多平台支持**
   - Facebook Ads
   - Google Ads
   - TikTok Ads
   - LinkedIn Ads
   - Twitter Ads

4. **高级分析**
   - 情感分析
   - 关键词提取
   - 视觉相似度分析
   - 受众定位分析

## 📞 支持和反馈

如有问题或建议，请：
1. 查看 [n8n 官方文档](https://docs.n8n.io/)
2. 访问 [n8n 社区论坛](https://community.n8n.io/)
3. 提交 GitHub Issue

## 📄 许可证

MIT License - 自由使用和修改

---

**创建日期**: 2025-01-20
**最后更新**: 2025-01-20
**版本**: 1.0.0
