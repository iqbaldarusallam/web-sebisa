import { createHash, timingSafeEqual } from "crypto";

export type MidtransTransactionInput = {
  orderId: string;
  amount: number;
  customerName: string;
  email?: string | null;
  phone?: string | null;
  serviceName: string;
  brand: string;
  finishRedirectUrl?: string | null;
};

export type MidtransSnapResponse = {
  token: string;
  redirect_url: string;
};

export type MidtransNotification = {
  transaction_time?: string;
  transaction_status: string;
  transaction_id?: string;
  status_message?: string;
  status_code: string;
  signature_key: string;
  payment_type?: string;
  order_id: string;
  gross_amount: string;
  fraud_status?: string;
};

export type MidtransClientConfig = {
  clientKey: string;
  snapScriptUrl: string;
  isProduction: boolean;
};

function getServerKey() {
  return process.env.MIDTRANS_SERVER_KEY;
}

function getClientKey() {
  return process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
}

export function isMidtransProduction() {
  return process.env.MIDTRANS_IS_PRODUCTION === "true";
}

export function getMidtransConfigIssue() {
  const serverKey = getServerKey();
  const clientKey = getClientKey();

  if (!serverKey || !clientKey) {
    return "MIDTRANS_SERVER_KEY and NEXT_PUBLIC_MIDTRANS_CLIENT_KEY are required.";
  }

  return null;
}

export function hasMidtransEnv() {
  return getMidtransConfigIssue() === null;
}

function getSnapBaseUrl() {
  return isMidtransProduction() ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
}

export function getMidtransClientConfig(): MidtransClientConfig {
  const configIssue = getMidtransConfigIssue();

  return {
    clientKey: configIssue ? "" : getClientKey() ?? "",
    snapScriptUrl: `${getSnapBaseUrl()}/snap/snap.js`,
    isProduction: isMidtransProduction(),
  };
}

export async function createMidtransSnapTransaction(input: MidtransTransactionInput) {
  const serverKey = getServerKey();

  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY is not configured.");
  }

  const configIssue = getMidtransConfigIssue();

  if (configIssue) {
    throw new Error(configIssue);
  }

  const response = await fetch(`${getSnapBaseUrl()}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.amount,
      },
      item_details: [
        {
          id: "sebisa-booking-project",
          price: input.amount,
          quantity: 1,
          name: `Booking ${input.serviceName}`.slice(0, 50),
          brand: input.brand.slice(0, 50),
        },
      ],
      customer_details: {
        first_name: input.customerName,
        email: input.email || undefined,
        phone: input.phone || undefined,
      },
      callbacks: input.finishRedirectUrl
        ? {
            finish: input.finishRedirectUrl,
          }
        : undefined,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Midtrans request failed with ${response.status}`);
  }

  return (await response.json()) as MidtransSnapResponse;
}

export function verifyMidtransNotification(payload: MidtransNotification) {
  const serverKey = getServerKey();

  if (
    !serverKey ||
    !payload.order_id ||
    !payload.status_code ||
    !payload.gross_amount ||
    !payload.signature_key ||
    !/^[a-f0-9]{128}$/i.test(payload.signature_key)
  ) {
    return false;
  }

  const raw = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
  const expected = createHash("sha512").update(raw).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(payload.signature_key, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}
