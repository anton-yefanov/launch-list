import { Webhooks } from "@dodopayments/nextjs";
import { NextResponse } from "next/server";

const webhookKey = process.env.DODO_WEBHOOK_SECRET;

async function sendTelegramMessage(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[Telegram] Bot token or chat ID not configured");
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      },
    );

    if (!response.ok) {
      console.error("[Telegram] Failed to send message:", await response.text());
    }
  } catch (error) {
    console.error("[Telegram] Error sending message:", error);
  }
}

export const POST = webhookKey
  ? Webhooks({
      webhookKey,
      onPaymentSucceeded: async (payload) => {
        const { customer, payment_id, total_amount } = payload.data;
        console.log(
          `[Dodo] Payment succeeded: ${payment_id}, Email: ${customer?.email}, Amount: ${total_amount}`,
        );

        await sendTelegramMessage(
          `💰 <b>New Payment!</b>\n\n` +
            `Payment ID: <code>${payment_id}</code>\n` +
            `Email: ${customer?.email || "N/A"}\n` +
            `Amount: $${(total_amount / 100).toFixed(2)}`,
        );
      },
    })
  : async () => {
      console.warn("[Dodo] Webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 },
      );
    };
