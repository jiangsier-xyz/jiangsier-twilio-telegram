export default {
  async fetch(request, env) {
    // 仅处理 POST 请求
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const signature = request.headers.get("X-Twilio-Signature");
      const contentType = request.headers.get("content-type");

      // 解析 Twilio 发送的 Form Data
      const formData = await request.formData();
      const params = Object.fromEntries(formData.entries());

      // 1. 校验 Twilio 签名
      const isValid = await verifySignature(
        env.TWILIO_AUTH_TOKEN,
        signature,
        env.WEBHOOK_URL,
        params
      );

      // if (!isValid) {
      //   return new Response("Unauthorized Signature", { status: 401 });
      // }

      // 2. 构造消息内容
      const from = params.From || "Unknown";
      const body = params.Body || "(No Content)";
      const to = params.To || "";
      const text = `🔔 *New SMS Received*\n\n*From:* \`${from}\`\n*To:* \`${to}\`\n\n*Content:*\n${body}`;

      // 3. 转发至 Telegram
      const tgUrl = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`;
      await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TG_CHAT_ID,
          text: text,
          parse_mode: "Markdown",
        }),
      });

      return new Response("Success", { status: 200 });
    } catch (err) {
      return new Response("Internal Error: " + err.message, { status: 500 });
    }
  },
};

/**
 * Twilio 签名校验算法
 */
async function verifySignature(authToken, signature, url, params) {
  if (!signature) return false;

  // 将参数按字典顺序排序并拼接
  const sortedKeys = Object.keys(params).sort();
  let data = url;
  for (const key of sortedKeys) {
    data += key + params[key];
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(authToken),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

  return expectedSignature === signature;
}
