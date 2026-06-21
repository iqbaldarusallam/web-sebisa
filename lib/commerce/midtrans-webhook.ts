import { applyMidtransNotification } from "@/lib/commerce/checkout";
import {
  verifyMidtransNotification,
  type MidtransNotification,
} from "@/lib/commerce/midtrans";

export async function handleMidtransWebhook(request: Request) {
  try {
    const payload = (await request.json()) as MidtransNotification;

    if (!verifyMidtransNotification(payload)) {
      return Response.json(
        {
          ok: false,
          message: "Invalid Midtrans signature.",
        },
        { status: 401 },
      );
    }

    await applyMidtransNotification(payload);

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error("Midtrans webhook failed:", error);
    return Response.json(
      {
        ok: false,
        message: "Notification handler failed.",
      },
      { status: 500 },
    );
  }
}
