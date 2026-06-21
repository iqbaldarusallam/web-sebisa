import { hasSupabaseAdminEnv, supabaseInsert } from "@/lib/integrations/supabase-rest";

function readText(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const name = readText(payload, "name");
    const brand = readText(payload, "brand");
    const product = readText(payload, "product");
    const whatsapp = readText(payload, "whatsapp");
    const email = readText(payload, "email") || null;
    const message = readText(payload, "message") || null;

    if (!name || !brand || !product || !whatsapp) {
      return Response.json(
        {
          ok: false,
          message: "Nama, brand, produk, dan WhatsApp wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (hasSupabaseAdminEnv()) {
      await supabaseInsert("contact_messages", {
        name,
        brand,
        product,
        whatsapp,
        email,
        message,
        status: "new",
      });
    }

    return Response.json({
      ok: true,
      persisted: hasSupabaseAdminEnv(),
    });
  } catch (error) {
    console.error("Contact submit failed:", error);
    return Response.json(
      {
        ok: false,
        message: "Pesan belum bisa dikirim. Coba lagi atau hubungi WhatsApp.",
      },
      { status: 500 },
    );
  }
}
