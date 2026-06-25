import {
  hasSupabaseAdminEnv,
  supabaseInsert,
  supabaseSelect,
  supabaseUpdateWhere,
} from "@/lib/integrations/supabase-rest";
import { getServicePrice } from "@/data/services";
import {
  createMidtransSnapTransaction,
  getMidtransConfigIssue,
  hasMidtransEnv,
  type MidtransNotification,
} from "./midtrans";
import { randomUUID } from "crypto";

export type CheckoutInput = {
  name: string;
  brand: string;
  serviceName: string;
  whatsapp: string;
  email?: string | null;
  notes?: string | null;
};

export type CheckoutResult = {
  orderCode: string;
  amount: number;
  paymentConfigured: boolean;
  snapToken: string | null;
  redirectUrl: string | null;
  token: string | null;
};

export type CheckoutOptions = {
  origin?: string;
};

function createManualPaymentResult(
  orderCode: string,
  amount: number,
): CheckoutResult {
  return {
    orderCode,
    amount,
    paymentConfigured: false,
    snapToken: null,
    redirectUrl: null,
    token: null,
  };
}

function sanitizeText(value: unknown, fallback = "") {
  return typeof value === "string"
    ? value.trim().slice(0, 500) || fallback
    : fallback;
}

export function checkoutAmount(serviceName: string): number | null {
  const price = getServicePrice(serviceName);

  return typeof price === "number" && Number.isFinite(price) && price > 0
    ? price
    : null;
}

async function checkoutAmountFromCms(serviceName: string): Promise<number | null> {
  if (!hasSupabaseAdminEnv()) {
    return checkoutAmount(serviceName);
  }

  try {
    const rows = await supabaseSelect<{ promo_price: number | null }>(
      "services",
      `select=promo_price&title=eq.${encodeURIComponent(serviceName)}&is_published=eq.true&limit=1`,
    );
    const price = rows[0]?.promo_price;

    if (typeof price === "number" && Number.isFinite(price) && price > 0) {
      return price;
    }
  } catch (error) {
    console.error("Checkout service price lookup failed:", error);
  }

  return checkoutAmount(serviceName);
}

export function normalizeCheckoutInput(
  payload: Record<string, unknown>,
): CheckoutInput {
  return {
    name: sanitizeText(payload.name),
    brand: sanitizeText(payload.brand),
    serviceName: sanitizeText(
      payload.serviceName,
      "Konsultasi Project Digital",
    ),
    whatsapp: sanitizeText(payload.whatsapp),
    email: sanitizeText(payload.email) || null,
    notes: sanitizeText(payload.notes) || null,
  };
}

export function validateCheckoutInput(input: CheckoutInput) {
  const required: (keyof CheckoutInput)[] = [
    "name",
    "brand",
    "serviceName",
    "whatsapp",
  ];
  const missing = required.filter((key) => !input[key]);

  return {
    ok: missing.length === 0,
    missing,
  };
}

function createOrderCode() {
  const date = new Date();
  const stamp = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("-", "");
  const random = randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();

  return `SP-${stamp}-${random}`;
}

function isLegacyProductColumnError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes('"product"') &&
    error.message.includes("not-null constraint")
  );
}

export async function createCheckout(
  input: CheckoutInput,
  options: CheckoutOptions = {},
): Promise<CheckoutResult> {
  const amount = await checkoutAmountFromCms(input.serviceName);
  if (amount == null) {
    throw new Error("SERVICE_PRICE_MISSING");
  }
  const orderCode = createOrderCode();
  const supabaseConfigured = hasSupabaseAdminEnv();
  let orderPersisted = false;

  if (supabaseConfigured) {
    const orderPayload = {
      order_code: orderCode,
      customer_name: input.name,
      brand: input.brand,
      service_name: input.serviceName,
      whatsapp: input.whatsapp,
      email: input.email,
      notes: input.notes,
      amount,
      status: "pending_payment",
      payment_status: "pending",
    };

    try {
      await supabaseInsert("orders", orderPayload);
      orderPersisted = true;
    } catch (error) {
      if (isLegacyProductColumnError(error)) {
        try {
          await supabaseInsert("orders", {
            ...orderPayload,
            product: input.serviceName,
          });
          orderPersisted = true;
        } catch (retryError) {
          console.error("Checkout order insert failed:", retryError);
        }
      } else {
        console.error("Checkout order insert failed:", error);
      }
    }
  }

  if (!hasMidtransEnv()) {
    console.warn("Midtrans is not ready:", getMidtransConfigIssue());
    return createManualPaymentResult(orderCode, amount);
  }

  let transaction;

  try {
    transaction = await createMidtransSnapTransaction({
      orderId: orderCode,
      amount,
      customerName: input.name,
      email: input.email,
      phone: input.whatsapp,
      serviceName: input.serviceName,
      brand: input.brand,
      finishRedirectUrl: options.origin
        ? `${options.origin}/checkout/success?order_id=${encodeURIComponent(orderCode)}`
        : null,
    });
  } catch (error) {
    console.error("Midtrans Snap transaction failed:", error);

    if (orderPersisted) {
      try {
        await supabaseUpdateWhere("orders", "order_code", orderCode, {
          payment_status: "payment_gateway_error",
          updated_at: new Date().toISOString(),
        });
      } catch (updateError) {
        console.error("Checkout order status update failed:", updateError);
      }
    }

    return createManualPaymentResult(orderCode, amount);
  }

  if (orderPersisted) {
    try {
      await supabaseInsert("payments", {
        order_code: orderCode,
        provider: "midtrans",
        payment_status: "pending",
        snap_token: transaction.token,
        redirect_url: transaction.redirect_url,
        amount,
      });
    } catch (error) {
      console.error("Checkout payment insert failed:", error);
    }
  }

  return {
    orderCode,
    amount,
    paymentConfigured: true,
    snapToken: transaction.token,
    redirectUrl: transaction.redirect_url,
    token: transaction.token,
  };
}

function mapMidtransToOrderStatus(status: string) {
  if (status === "settlement" || status === "capture") {
    return "paid";
  }

  if (status === "expire") {
    return "expired";
  }

  if (status === "deny" || status === "failure") {
    return "failed";
  }

  if (status === "cancel") {
    return "cancelled";
  }

  return "pending_payment";
}

export async function applyMidtransNotification(payload: MidtransNotification) {
  if (!hasSupabaseAdminEnv()) {
    return { persisted: false };
  }

  const paidAt =
    payload.transaction_status === "settlement" ||
    payload.transaction_status === "capture"
      ? new Date().toISOString()
      : null;

  await supabaseInsert("payment_events", {
    order_code: payload.order_id,
    provider: "midtrans",
    event_type: payload.transaction_status,
    payload,
  });

  await supabaseUpdateWhere("orders", "order_code", payload.order_id, {
    status: mapMidtransToOrderStatus(payload.transaction_status),
    payment_status: payload.transaction_status,
    payment_method: payload.payment_type ?? null,
    paid_at: paidAt,
    updated_at: new Date().toISOString(),
  });

  await supabaseUpdateWhere("payments", "order_code", payload.order_id, {
    payment_status: payload.transaction_status,
    updated_at: new Date().toISOString(),
  });

  return { persisted: true };
}
