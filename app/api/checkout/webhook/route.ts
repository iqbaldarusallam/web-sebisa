import { handleMidtransWebhook } from "@/lib/commerce/midtrans-webhook";

export async function POST(request: Request) {
  return handleMidtransWebhook(request);
}
