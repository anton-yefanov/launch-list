import { getPaddleInstance } from "@/utils/paddle/get-paddle-instance";
import { NextRequest } from "next/server";
import { ProcessWebhook } from "@/utils/paddle/process-webhook";

const webhookProcessor = new ProcessWebhook();

export async function POST(request: NextRequest) {
  const signature = request.headers.get("paddle-signature");
  const rawRequestBody = await request.text();
  const privateKey = process.env.WEBHOOK_SECRET_KEY || "";

  try {
    if (!signature || !rawRequestBody) {
      return Response.json(
        { error: "Missing signature from header" },
        { status: 400 },
      );
    }

    const paddle = getPaddleInstance();
    const eventData = await paddle.webhooks.unmarshal(
      rawRequestBody,
      privateKey,
      signature,
    );

    const eventName = eventData?.eventType ?? "Unknown event";

    if (eventData) {
      await webhookProcessor.processEvent(eventData);
    }

    return Response.json({ status: 200, eventName });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
