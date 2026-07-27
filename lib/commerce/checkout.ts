import {
  hasSupabaseAdminEnv,
  supabaseInsert,
  supabaseSelect,
  supabaseUpdateWhere,
} from "@/lib/integrations/supabase-rest";
import { getServicePrice } from "@/data/services";
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
  whatsappUrl: string | null;
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
    whatsappUrl: null,
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

  // Build WhatsApp message with order details
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const waMessage = encodeURIComponent(
    `Halo Sebisa Project!\n\n` +
    `Saya ingin melakukan pembayaran untuk order:\n` +
    `• Kode Order: ${orderCode}\n` +
    `• Layanan: ${input.serviceName}\n` +
    `• Brand: ${input.brand}\n` +
    `• Total: Rp ${amount.toLocaleString("id-ID")}\n\n` +
    `Mohon instruksi pembayaran selanjutnya. Terima kasih.`
  );
  const whatsappUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return {
    orderCode,
    amount,
    paymentConfigured: true,
    whatsappUrl,
  };
}

