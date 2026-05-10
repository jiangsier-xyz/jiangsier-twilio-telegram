# Twilio SMS to Telegram Forwarder (Cloudflare Workers)

A lightweight Cloudflare Worker that automatically forwards incoming Twilio SMS messages to your Telegram Bot.

## 🚀 Deployment Steps

### 1. Preparation (Fork the Repository)
Since this project uses GitHub integration for automatic deployment, please click **Fork** at the top right to clone this repository to your own GitHub account first.

### 2. Local Configuration
Before deploying, it is recommended to modify the `wrangler.toml` file:
* Change `name = "jiangsier-twilio-telegram"` to your preferred Worker name.

### 3. Deploy via Cloudflare Dashboard
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** -> **Create application** -> **Workers** -> **Connect to Git**.
3. Select your forked GitHub repository.
4. **Build settings**:
   - **Build command**: Leave blank.
   - **Build output directory**: Leave blank.
5. Click **Save and Deploy**.

---

## 🔑 Environment Variables Setup

After deployment, navigate to **Settings -> Variables** in your Worker dashboard to add the following keys.

### A. Telegram Settings
* **`TG_BOT_TOKEN`**: 
  - Obtain this from `@BotFather` on Telegram by creating a new bot.
* **`TG_CHAT_ID`**: 
  - Obtain your numerical ID from `@userinfobot` on Telegram.

### B. Twilio Settings
* **`TWILIO_AUTH_TOKEN`**: 
  - Find this in the **Account Info** section of your [Twilio Console](https://console.twilio.com/).
* **`WEBHOOK_URL`**: 
  - Your Worker's public URL (e.g., `https://sms.yourname.tech/`).

> **Security Note**: Click **Encrypt** for `TG_BOT_TOKEN` and `TWILIO_AUTH_TOKEN` to keep them secure.

---

## 🛠 Twilio Console Configuration (Important)

1. **Disable Conversations Interception**:
   - Go to **Messaging > Services**.
   - If your number is part of a `Sender Pool` in any Messaging Service, **Remove** it. Otherwise, Twilio Conversations will intercept the SMS and your Worker won't be triggered.

2. **Configure Webhook**:
   - Navigate to **Phone Numbers > Active Numbers** and select your number.
   - Under the **Messaging** section, find **A MESSAGE COMES IN**.
   - Select **Webhook** and paste your `WEBHOOK_URL`.
   - Ensure **HTTP POST** is selected and click **Save**.

3. **Backup Method (TwiML Bin)**:
   - Create a TwiML Bin with `<Response></Response>` and set it as the **Backup Method** to handle potential timeout issues and ensure silent processing.
