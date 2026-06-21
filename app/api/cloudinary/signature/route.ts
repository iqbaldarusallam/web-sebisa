import { createHash } from "crypto";
import { hasAdminSession } from "@/lib/admin/auth";

const allowedFolders = new Set([
  "sebisa/portfolio",
  "sebisa/team",
  "sebisa/clients",
]);

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return Response.json(
      {
        ok: false,
        message: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    return Response.json(
      {
        ok: false,
        message: "Fitur upload gambar belum aktif.",
      },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as { folder?: string };
  const folder = allowedFolders.has(payload.folder ?? "")
    ? (payload.folder as string)
    : "sebisa/portfolio";
  const timestamp = Math.round(Date.now() / 1000);
  const params = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(params).digest("hex");

  return Response.json({
    ok: true,
    cloudName,
    apiKey,
    folder,
    timestamp,
    signature,
  });
}
