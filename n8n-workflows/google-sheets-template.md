# Google Sheets 模板设置指南

## 快速设置步骤

### 1. 创建新的 Google Sheets

1. 访问 [Google Sheets](https://sheets.google.com)
2. 点击"空白"创建新表格
3. 命名为"竞争对手广告监控"

### 2. 创建工作表

创建以下3个工作表（Sheet）：

#### 工作表1：Competitors

**用途**: 存储竞争对手配置

**列标题** (第1行):
```
A: 竞争对手名称
B: 广告库URL
C: 是否启用
D: 备注
```

**示例数据** (第2行开始):
```
品牌A | https://www.facebook.com/ads/library/?q=品牌A | TRUE | 主要竞争对手
品牌B | https://www.facebook.com/ads/library/?q=品牌B | TRUE | 次要竞争对手
品牌C | https://www.facebook.com/ads/library/?q=品牌C | FALSE | 暂时关闭
```

**格式设置**:
- 第1行: 加粗，背景色 #4285F4（蓝色），文字白色
- C列: 数据验证 → 列表 → TRUE, FALSE

---

#### 工作表2：AdsData

**用途**: 存储爬取的广告数据

**列标题** (第1行):
```
A: 广告ID
B: 竞争对手
C: 爬取日期
D: 广告标题
E: 广告描述
F: 广告文案
G: CTA按钮
H: 图片数量
I: 视频数量
J: 落地页URL
K: 平台
L: 广告格式
M: 展示次数
N: 互动数
O: 广告开始日期
P: 是否活跃
Q: 图片URLs
R: 视频URLs
S: 创建时间
T: 最后更新时间
```

**格式设置**:
- 第1行: 加粗，背景色 #34A853（绿色），文字白色
- C列、O列、S列、T列: 格式 → 日期 → 2025-01-20
- H列、I列、M列、N列: 格式 → 数字 → 0
- P列: 数据验证 → 列表 → TRUE, FALSE
- 冻结第1行: 视图 → 冻结 → 1行

**条件格式**:
1. 选中P列（是否活跃）
2. 格式 → 条件格式
3. 如果单元格 = TRUE，背景色绿色
4. 如果单元格 = FALSE，背景色灰色

---

#### 工作表3：ExecutionLog

**用途**: 记录工作流执行日志

**列标题** (第1行):
```
A: 执行时间
B: 总广告数
C: 新增广告
D: 重复广告
E: 处理时长(秒)
F: 执行状态
G: 错误信息
```

**格式设置**:
- 第1行: 加粗，背景色 #FBBC04（黄色），文字黑色
- A列: 格式 → 日期时间 → 2025-01-20 09:00:00
- B列、C列、D列: 格式 → 数字 → 0
- E列: 格式 → 数字 → 0.00
- F列: 数据验证 → 列表 → SUCCESS, FAILED, PARTIAL

**条件格式**:
1. 选中F列（执行状态）
2. 如果单元格 = "SUCCESS"，背景色绿色
3. 如果单元格 = "FAILED"，背景色红色
4. 如果单元格 = "PARTIAL"，背景色橙色

---

#### 工作表4：Statistics (可选)

**用途**: 统计分析仪表板

**创建图表**:
1. 插入 → 图表
2. 选择数据范围: AdsData!B:B, AdsData!C:C
3. 图表类型: 柱状图
4. 标题: "每个竞争对手的广告数量"

**创建透视表**:
1. 数据 → 透视表
2. 行: 竞争对手
3. 列: 广告格式
4. 值: 广告ID（计数）

---

## 3. 共享和权限设置

### 方法1: 公开共享（不推荐用于敏感数据）
1. 点击右上角"共享"
2. 更改为"知道链接的任何人"
3. 权限选择"查看者"或"编辑者"

### 方法2: 使用服务账户（推荐）
1. 在 Google Cloud Console 创建服务账户
2. 下载 JSON 密钥文件
3. 复制服务账户邮箱地址（类似 xxx@xxx.iam.gserviceaccount.com）
4. 在 Google Sheets 中点击"共享"
5. 粘贴服务账户邮箱，权限选择"编辑者"

---

## 4. 获取 Spreadsheet ID

1. 打开你的 Google Sheets
2. 查看URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. 复制 `{SPREADSHEET_ID}` 部分
4. 粘贴到 n8n 工作流配置中

示例:
```
URL: https://docs.google.com/spreadsheets/d/1abc123XYZ789/edit
Spreadsheet ID: 1abc123XYZ789
```

---

## 5. 高级功能

### 自动数据验证

**A. 广告ID唯一性检查**
```
=COUNTIF($A:$A, A2) > 1
```
如果结果为TRUE，说明ID重复，标记为红色

**B. URL格式验证**
```
=IF(ISURL(J2), "✓", "✗")
```
验证落地页URL是否有效

### 自动计算字段

**A. 图片/视频总数**
```
=H2+I2
```

**B. 广告活跃天数**
```
=DAYS(TODAY(), O2)
```

**C. 互动率**
```
=IF(M2>0, N2/M2*100, 0) & "%"
```

### 数据保护

1. 数据 → 保护工作表和范围
2. 选择"Competitors!A1:D1"（标题行）
3. 设置权限: "仅自己"可以编辑

---

## 6. 公式示例

### 统计看板（可放在单独的工作表）

```
总广告数: =COUNTA(AdsData!A:A)-1
今日新增: =COUNTIF(AdsData!C:C, TODAY())
活跃广告: =COUNTIF(AdsData!P:P, TRUE)
图片广告: =COUNTIF(AdsData!L:L, "image")+COUNTIF(AdsData!L:L, "carousel")
视频广告: =COUNTIF(AdsData!L:L, "video")

竞争对手A的广告数: =COUNTIF(AdsData!B:B, "品牌A")
本周爬取次数: =COUNTIF(ExecutionLog!A:A, ">="&TODAY()-7)
成功率: =COUNTIF(ExecutionLog!F:F, "SUCCESS")/COUNTA(ExecutionLog!F:F)*100&"%"
```

---

## 7. 导入模板

### 使用CSV导入

1. 文件 → 导入 → 上传
2. 选择 `competitors-config-template.csv`
3. 导入位置: "替换当前工作表"或"插入新工作表"

### 手动复制粘贴

直接将示例数据复制粘贴到对应工作表

---

## 8. 定期维护

### 每周任务
- [ ] 检查是否有重复数据
- [ ] 清理失效的广告
- [ ] 更新竞争对手列表

### 每月任务
- [ ] 导出数据备份
- [ ] 分析广告趋势
- [ ] 优化爬取配置

### 每季度任务
- [ ] 归档旧数据
- [ ] 审查竞争对手列表
- [ ] 更新分析维度

---

## 常见问题

**Q: 如何批量更新数据？**
A: 使用 Google Sheets 的 IMPORTRANGE 函数或 Apps Script

**Q: 数据太多导致卡顿？**
A: 定期归档旧数据到新的工作表，或使用 Google BigQuery

**Q: 如何自动生成报告？**
A: 使用 Google Data Studio 连接 Google Sheets 创建仪表板

**Q: 能否自动发送邮件？**
A: 使用 Google Apps Script 的 MailApp 服务

---

## 资源链接

- [Google Sheets 函数列表](https://support.google.com/docs/table/25273)
- [Google Apps Script 文档](https://developers.google.com/apps-script)
- [条件格式教程](https://support.google.com/docs/answer/78413)
