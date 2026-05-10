# Twilio SMS 转发至 Telegram (Cloudflare Workers 版)

本项目是一个轻量级的 Cloudflare Worker，能够将收到的 Twilio 短信自动转发到你的 Telegram 机器人。

## 🚀 部署步骤

### 1. 准备工作 (Fork 项目)
由于本项目需要关联你的 GitHub 帐号进行自动化部署，请先点击页面右上角的 **Fork**，将本项目克隆到你自己的 GitHub 帐号下。

### 2. 修改配置
在部署前，建议修改根目录下的 `wrangler.toml` 文件：
* 将 `name = "jiangsier-twilio-telegram"` 修改为你喜欢的 Worker 名称（此名称将决定你的默认子域名）。

### 3. 在 Cloudflare 控制台部署
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 进入 **Workers & Pages** -> **Create application** -> **Workers** -> **Connect to Git**。
3. 选择你 Fork 后的 GitHub 仓库。
4. **构建设置 (Build settings)**：
   - **Build command**: 留空（不需要）。
   - **Build output directory**: 留空（默认根目录）。
5. 点击 **Save and Deploy**。

---

## 🔑 环境变量获取与设置

部署完成后，你需要在 Worker 的 **Settings -> Variables** 中添加以下四个环境变量。

### A. Telegram 相关
* **`TG_BOT_TOKEN`**: 
  - 在 Telegram 搜索 `@BotFather`，创建机器人后获取 API Token。
* **`TG_CHAT_ID`**: 
  - 在 Telegram 搜索 `@userinfobot`，发送消息即可获取你的数字 ID。

### B. Twilio 相关
* **`TWILIO_AUTH_TOKEN`**: 
  - 登录 [Twilio Console](https://console.twilio.com/)，在首页 **Account Info** 处复制。
* **`WEBHOOK_URL`**: 
  - 你的 Worker 自定义域名（例如 `https://sms.yourname.tech/`）。

> **安全提示**：请对 `TG_BOT_TOKEN` 和 `TWILIO_AUTH_TOKEN` 点击 **Encrypt** 进行加密处理。

---

## 🛠 Twilio 后台配置 (关键)

为确保转发成功，请务必完成以下设置：

1. **移除 Conversations 拦截**：
   - 前往 **Messaging > Services**。
   - 如果你的号码在某个 Service 的 `Sender Pool` 中，请点击 **Remove** 将其移除。否则短信会被系统拦截，Worker 无法收到请求。

2. **设置 Webhook**：
   - 进入 **Phone Numbers > Active Numbers**，点击你的号码。
   - 在 **Messaging** 模块，找到 **A MESSAGE COMES IN**。
   - 选择 **Webhook**，填入你的 `WEBHOOK_URL`。
   - 确保右侧选择 **HTTP POST** 并点击 **Save**。

3. **设置备用回复 (TwiML Bin)**：
   - 建议创建一个内容为 `<?xml version="1.0" encoding="UTF-8"?><Response></Response>` 的 TwiML Bin，并设为号码的 **Backup Method**，以应对可能的网络波动。
