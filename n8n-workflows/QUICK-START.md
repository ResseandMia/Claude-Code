# 🚀 快速开始指南

## 5分钟快速部署

### 步骤1: 准备 Google Sheets (2分钟)

1. **创建新的 Google Sheets**
   - 访问 https://sheets.google.com
   - 点击"空白"创建新表格
   - 命名为"竞争对手广告监控"

2. **创建3个工作表**
   ```
   Sheet1: Competitors (竞争对手配置)
   Sheet2: AdsData (广告数据)
   Sheet3: ExecutionLog (执行日志)
   ```

3. **复制列标题**

   **Competitors 工作表**:
   ```
   竞争对手名称 | 广告库URL | 是否启用 | 备注
   ```

   **AdsData 工作表**:
   ```
   广告ID | 竞争对手 | 爬取日期 | 广告标题 | 广告描述 | 广告文案 | CTA按钮 | 图片数量 | 视频数量 | 落地页URL | 平台 | 广告格式 | 展示次数 | 互动数 | 广告开始日期 | 是否活跃 | 图片URLs | 视频URLs
   ```

   **ExecutionLog 工作表**:
   ```
   执行时间 | 总广告数 | 新增广告 | 重复广告 | 处理时长 | 执行状态
   ```

4. **添加示例竞争对手**
   在 Competitors 工作表第2行添加:
   ```
   测试品牌 | https://www.facebook.com/ads/library/?q=test | TRUE | 测试用
   ```

5. **获取 Spreadsheet ID**
   - URL: `https://docs.google.com/spreadsheets/d/【这部分就是ID】/edit`
   - 复制保存，稍后使用

---

### 步骤2: 创建 Google Drive 文件夹 (1分钟)

1. 访问 https://drive.google.com
2. 创建文件夹"广告监控"
3. 在URL中复制文件夹ID:
   ```
   https://drive.google.com/drive/folders/【这部分就是ID】
   ```

---

### 步骤3: 导入 n8n 工作流 (1分钟)

1. **登录 n8n**
   - 本地: http://localhost:5678
   - 云端: https://app.n8n.cloud

2. **导入工作流**
   - 点击右上角菜单 → Import from File
   - 选择 `competitor-ad-monitoring.json`
   - 点击 Import

3. **工作流已导入完成！** 🎉

---

### 步骤4: 配置凭证 (1分钟)

#### A. Google OAuth2 (用于 Sheets 和 Drive)

1. 点击任意 Google Sheets 节点
2. 点击 Credential 下拉框 → "Create New Credential"
3. 选择 "Google OAuth2 API"
4. 点击 "Connect my account"
5. 登录你的 Google 账户并授权
6. 保存凭证

#### B. Anthropic API (用于 Claude)

1. 访问 https://console.anthropic.com/
2. 创建 API Key
3. 在 n8n 中点击 Claude API 节点
4. 添加 HTTP Header Authentication:
   ```
   Name: x-api-key
   Value: 【你的 Anthropic API Key】
   ```

#### C. SMTP (用于邮件)

**选项1: Gmail (推荐)**
1. 启用 Gmail 的两步验证
2. 生成应用专用密码: https://myaccount.google.com/apppasswords
3. 在 n8n 添加 SMTP 凭证:
   ```
   Host: smtp.gmail.com
   Port: 587
   User: your-email@gmail.com
   Password: 【应用专用密码】
   ```

**选项2: Outlook**
```
Host: smtp-mail.outlook.com
Port: 587
User: your-email@outlook.com
Password: 【你的密码】
```

---

### 步骤5: 更新配置参数

#### 需要替换的ID（共6处）:

1. **读取竞争对手列表** 节点
   ```javascript
   "url": "https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values/Competitors!A2:C"
   ```
   替换 `YOUR_SPREADSHEET_ID` 为你的 Sheets ID

2. **检查广告是否已存在** 节点
   ```javascript
   "url": "https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values/AdsData!A:A"
   ```

3. **保存到Google Sheets** 节点
   ```javascript
   "sheetId": "YOUR_SPREADSHEET_ID"
   ```

4. **记录执行日志** 节点
   ```javascript
   "sheetId": "YOUR_SPREADSHEET_ID"
   ```

5. **上传图片到Google Drive** 节点
   ```javascript
   "folderId": "YOUR_GOOGLE_DRIVE_FOLDER_ID"
   ```
   替换为你的 Drive 文件夹 ID

6. **上传视频到Google Drive** 节点
   ```javascript
   "folderId": "YOUR_GOOGLE_DRIVE_FOLDER_ID"
   ```

#### 更新邮件地址（2处）:

7. **发送邮件通知** 节点
   ```javascript
   "fromEmail": "your-email@example.com",
   "toEmail": "recipient@example.com"
   ```

8. **发送错误通知** 节点
   ```javascript
   "fromEmail": "your-email@example.com",
   "toEmail": "admin@example.com"
   ```

---

### 步骤6: 测试运行

#### 手动测试

1. **点击"定时触发器"节点**
2. **点击"Execute Node"按钮**
3. **观察执行流程**
   - 绿色 ✓ = 成功
   - 红色 ✗ = 失败
4. **检查每个节点的输出数据**

#### 验证结果

✅ **Google Sheets**: 查看 AdsData 是否有新数据
✅ **Google Drive**: 查看是否创建了文件夹和文件
✅ **邮箱**: 查看是否收到报告邮件

---

### 步骤7: 激活自动运行

1. **保存工作流** (Ctrl+S 或点击保存按钮)
2. **激活工作流** (点击右上角的 "Inactive" 切换为 "Active")
3. **工作流现在会自动运行** 🎉
   - 每周一上午9点
   - 每周四上午9点

---

## 🎯 下一步

### 自定义爬取逻辑

当前工作流使用的是示例爬取逻辑，你需要根据实际广告平台调整：

#### Facebook Ads Library (推荐新手)

1. 注册 Facebook 开发者账号
2. 创建应用并获取 Access Token
3. 修改"爬取广告数据"节点:

```javascript
{
  "url": "https://graph.facebook.com/v18.0/ads_archive",
  "method": "GET",
  "qs": {
    "access_token": "YOUR_FB_ACCESS_TOKEN",
    "search_terms": "={{ $json.competitorName }}",
    "ad_reached_countries": "US",
    "fields": "id,ad_creative_body,ad_creative_link_caption,ad_snapshot_url,page_name,impressions"
  }
}
```

#### 其他平台

- **Google Ads**: 使用 Google Ads API
- **TikTok Ads**: 使用 TikTok Creative Center
- **LinkedIn Ads**: 暂无公开API，需要使用爬虫
- **Twitter Ads**: 使用 Twitter Ads API

参考 [README.md](./README.md) 中的"自定义爬取逻辑"章节

---

### 调整触发时间

修改"定时触发器"节点的 Cron 表达式:

```javascript
// 当前: 每周一、四上午9点
"0 9 * * 1,4"

// 每天上午10点
"0 10 * * *"

// 每周一上午9点和下午3点
"0 9,15 * * 1"

// 每小时
"0 * * * *"
```

使用 [Crontab Guru](https://crontab.guru/) 生成自定义表达式

---

### 添加更多竞争对手

1. 打开 Google Sheets
2. 在 Competitors 工作表添加新行:
   ```
   品牌名称 | 广告库URL | TRUE | 备注
   ```
3. 保存即可，下次运行会自动爬取

---

## 🆘 遇到问题？

### 常见错误

**错误1: "Spreadsheet not found"**
- 解决: 检查 Spreadsheet ID 是否正确
- 确认 Google 账户有访问权限

**错误2: "Invalid credentials"**
- 解决: 重新创建 Google OAuth2 凭证
- 确认已授予所有必要权限

**错误3: "Rate limit exceeded"**
- 解决: 减少爬取频率
- 添加延迟节点（Wait 节点）

**错误4: "Claude API error"**
- 解决: 检查 API Key 是否有效
- 确认账户有足够余额
- 减少发送的数据量

**错误5: "Email send failed"**
- 解决: 检查 SMTP 凭证
- 对于 Gmail，确认使用应用专用密码
- 检查防火墙设置

---

### 调试技巧

1. **查看节点输出**
   - 点击节点查看 Input/Output 数据
   - 检查数据格式是否正确

2. **逐个测试节点**
   - 右键节点 → "Execute Node"
   - 从前往后依次测试

3. **启用详细日志**
   - Settings → Log Output → Verbose

4. **使用断点**
   - 在关键节点后添加 "Stop and Error" 节点
   - 检查中间数据

---

### 获取帮助

- 📚 [完整文档](./README.md)
- 🔧 [Google Sheets 模板指南](./google-sheets-template.md)
- 💬 [n8n 社区](https://community.n8n.io/)
- 🐛 [报告问题](https://github.com/n8n-io/n8n/issues)

---

## ✅ 检查清单

完成设置后，确认以下所有项目:

- [ ] Google Sheets 已创建，包含3个工作表
- [ ] Google Drive 文件夹已创建
- [ ] n8n 工作流已导入
- [ ] Google OAuth2 凭证已配置
- [ ] Anthropic API Key 已添加
- [ ] SMTP 邮件凭证已设置
- [ ] 所有 Spreadsheet ID 已替换（共4处）
- [ ] 所有 Drive Folder ID 已替换（共2处）
- [ ] 所有邮件地址已更新（共2处）
- [ ] 手动测试运行成功
- [ ] Google Sheets 有测试数据
- [ ] 收到测试邮件
- [ ] 工作流已激活

全部完成？恭喜！🎉 你的广告监控系统已经上线！

---

**预计时间**: 5-10 分钟
**难度**: ⭐⭐☆☆☆ (简单)
**成本**: 免费（Google/n8n 免费额度）+ Anthropic API（按使用付费）
