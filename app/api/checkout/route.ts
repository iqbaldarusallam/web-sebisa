import {
  createCheckout,
  normalizeCheckoutInput,
  validateCheckoutInput,
} from "@/lib/commerce/checkout";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const input = normalizeCheckoutInput(payload);
    const validation = validateCheckoutInput(input);

    if (!validation.ok) {
      return Response.json(
        {
          ok: false,
          message: "Data checkout belum lengkap.",
          missing: validation.missing,
        },
        { status: 400 },
      );
    }

    let result;
    try {
      result = await createCheckout(input, {
        origin: new URL(request.url).origin,
      });
    } catch (err) {
      if (err instanceof Error && err.message === "SERVICE_PRICE_MISSING") {
        return Response.json(
          {
            ok: false,
            message:
              "Harga layanan belum tersedia. Silakan hubungi admin atau pilih layanan lain.",
          },
          { status: 400 },
        );
      }

      throw err;
    }

    return Response.json({
      ok: true,
      snap_token: result.snapToken,
      ...result,
    });
  } catch (error) {
    console.error("Checkout failed:", error);
    return Response.json(
      {
        ok: false,
        message: "Checkout belum bisa diproses. Coba lagi atau hubungi admin.",
      },
      { status: 500 },
    );
  }
}
