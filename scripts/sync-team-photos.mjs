import { createHash } from "crypto";
import { existsSync, readFileSync, readdirSync } from "fs";
import { resolve } from "path";

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadLocalEnv();

const PHOTO_DIR = resolve(process.env.HOME || process.env.USERPROFILE, "Downloads/foto tim sebisa");
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
const SUPA_KEY = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const CLOUD = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CKEY = process.env.CLOUDINARY_API_KEY;
const CSECRET = process.env.CLOUDINARY_API_SECRET;
const FOLDER = "sebisa/team";
const DRY = process.argv.includes("--dry");

const D = {
  hr: "Mengelola kebutuhan SDM, administrasi internal, koordinasi rekrutmen, dan menjaga alur kerja tim tetap tertata.",
  ve: "Menangani proses produksi visual, mulai dari pengambilan gambar, editing video, hingga finalisasi konten.",
  cp: "Menyusun ide konten, kalender publikasi, brief produksi, dan arah komunikasi agar konten lebih konsisten.",
  va: "Membantu kebutuhan administrasi, koordinasi pekerjaan harian, dan support operasional agar proses lebih efisien.",
  bd: "Membangun peluang kerja sama, menjaga relasi prospek, dan membantu pengembangan kebutuhan bisnis klien.",
  sr: "Menghubungi calon klien, menjelaskan layanan, mengelola follow-up, dan membantu proses konversi penjualan.",
  sm: "Mengelola publikasi konten, caption, jadwal posting, dan aktivitas sosial media brand secara konsisten.",
  wd: "Membangun dan mengembangkan website yang responsif, stabil, dan sesuai kebutuhan bisnis atau campaign.",
  gd: "Membuat kebutuhan visual brand, desain konten, materi promosi, dan aset kreatif untuk berbagai kanal digital.",
  dm: "Menyusun strategi campaign, membaca performa digital, dan mengoptimalkan kanal pemasaran agar lebih terarah.",
  ga: "Mendukung kebutuhan operasional, administrasi umum, dan kelancaran aktivitas internal tim.",
  fin: "Mengelola pencatatan keuangan, penganggaran, dan administrasi finansial agar operasional tim tetap sehat.",
};

// file -> canonical member. position/division/desc only used when INSERT (new member).
const MAP = [
  // ===== existing (patch image only) =====
  { file: "Digital Marketing - Rhe Rizal Pizzi Alfansyah.jpg", name: "Rhe Rizal Pizzi Alfansyah" },
  { file: "Social Media Specialist - Diva Astriani.jpg", name: "Diva Astriani" },
  { file: "Human Resources (HR) - Ridho Firdausman.jpg", name: "Ridho Firdausman" },
  { file: "General Admin (GA) - Salsabilla Restianita.jpg", name: "Salsabilla Restianita" },
  { file: "Virtual Assistant (VA) - Shelomitha Kumala Mawardhany.jpg", name: "Shelomitha Kumala Mawardhany" },
  { file: "Sales Representative - Khafiel Ramadhan.jpg", name: "Khafiel Ramadhan Putra Riyano" },
  { file: "Digital Marketing - Vidya Firya Fitriani.jpg", name: "Vidya Firya Fitriani" },
  { file: "Web Developer (IT) - Iqbal Darusallam.png", name: "Iqbal Darusallam" },
  { file: "Virtual Assistant (VA) - Bening Nuha Nirmala.jpg", name: "Bening Nuha Nirmala" },
  { file: "Graphic Design - Amallya Salsabila.jpeg", name: "Amallya Salsabila Harahap" },
  { file: "Human Resources (HR) - Amanda Hanifah Nur Hilizza.jpeg", name: "Amanda Hanifah Nur Hilizza" },
  { file: "Business Development - Vian Leviyani.jpeg", name: "Vian Leviyani" },
  { file: "Graphic Design - Muhamad Khalid Umar.jpg", name: "Muhamad Khalid Umar" },
  { file: "Content Planner - Raditya Hafizh Sopian.JPG", name: "Raditya Hafizh Sopian" },
  { file: "Video Editor & Videographer - Fauzan Akbar.jpg", name: "Muhammad Fauzan Akbar" },
  { file: "Content Planner - Oscadeon.jpg", name: "Oscadeon" },
  { file: "Human Resources (HR) - Henida Nuha.jpg", name: "Henida Nuha Nafisa" },
  // ===== new (insert) =====
  { file: "Human Resources (HR) - Anisa Nafsah Tiara.jpeg", name: "Anisa Nafsah Tiara", division: "Business Support", position: "Human Resources", description: D.hr },
  { file: "Human Resources (HR) - Tiara Aquila Putri.jpg", name: "Tiara Aquila Putri", division: "Business Support", position: "Human Resources", description: D.hr },
  { file: "Human Resources (HR) - Annisa Fathania Alfi Syahrani.jpg", name: "Annisa Fathania Alfi Syahrani", division: "Business Support", position: "Human Resources", description: D.hr },
  { file: "General Admin (GA) - Pavita Widya Pramono.png", name: "Pavita Widya Pramono", division: "Business Support", position: "General Affairs", description: D.ga },
  { file: "Finance - Ade Yuwaroh.jpg", name: "Ade Yuwaroh", division: "Business Support", position: "Finance", description: D.fin },
  { file: "Video Editor & Videographer - Naufal Hanif Saputra.heic", name: "Naufal Hanif Saputra", division: "Production", position: "Video Editor & Videographer", description: D.ve },
  { file: "Social Media Specialist - Ishika Rahmania Luhri.jpg", name: "Ishika Rahmania Luhri", division: "Production", position: "Social Media Specialist", description: D.sm },
  { file: "Social Media Specialist - Lisa Putri Rahmawati.heif", name: "Lisa Putri Rahmawati", division: "Production", position: "Social Media Specialist", description: D.sm },
  { file: "Graphic Design - Abdaffa Koizumi Dzaki.jpg", name: "Abdaffa Koizumi Dzaki", division: "Production", position: "Graphic Design", description: D.gd },
  { file: "Web Developer (IT) - Achmad Fariz Salim.png", name: "Achmad Fariz Salim", division: "Production", position: "Web Developer", description: D.wd },
  { file: "Digital Marketing - Aaqilah Meutia Aliifa.jpg", name: "Aaqilah Meutia Aliifa", division: "Marketing", position: "Digital Marketing", description: D.dm },
  { file: "Virtual Assistant (VA) - Haifa Nabila.jpg", name: "Haifa Nabila", division: "Virtual Assistant", position: "Virtual Assistant", description: D.va },
];

const supaHeaders = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json" };

function contentType(file) {
  const e = file.toLowerCase().split(".").pop();
  return { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", heic: "image/heic", heif: "image/heif" }[e] || "application/octet-stream";
}

async function uploadToCloudinary(file) {
  const path = resolve(PHOTO_DIR, file);
  const buf = readFileSync(path);
  const ts = Math.floor(Date.now() / 1000);
  const toSign = `folder=${FOLDER}&timestamp=${ts}`;
  const signature = createHash("sha1").update(toSign + CSECRET).digest("hex");
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type: contentType(file) }), file);
  fd.append("api_key", CKEY);
  fd.append("timestamp", String(ts));
  fd.append("folder", FOLDER);
  fd.append("signature", signature);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok || !json.secure_url) throw new Error("Cloudinary: " + (json.error?.message || res.status));
  let url = json.secure_url;
  // transcode heic/heif to jpg on delivery
  url = url.replace(/\.(heic|heif)$/i, ".jpg").replace(/\/upload\/(?!f_)/, "/upload/f_auto,q_auto/");
  return url;
}

async function getExisting() {
  const res = await fetch(`${SUPA_URL}/rest/v1/team_members?select=id,name,sort_order`, { headers: supaHeaders });
  const rows = await res.json();
  const byName = new Map(rows.map((r) => [r.name.toLowerCase().trim(), r]));
  const maxOrder = rows.reduce((a, r) => Math.max(a, r.sort_order || 0), 0);
  return { byName, maxOrder };
}

async function patchImage(id, url) {
  const res = await fetch(`${SUPA_URL}/rest/v1/team_members?id=eq.${id}`, {
    method: "PATCH", headers: { ...supaHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({ image_url: url, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error("PATCH: " + (await res.text()));
}

async function insertMember(m, url, order) {
  const res = await fetch(`${SUPA_URL}/rest/v1/team_members`, {
    method: "POST", headers: { ...supaHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({ name: m.name, division: m.division, position: m.position, description: m.description, image_url: url, is_published: true, sort_order: order }),
  });
  if (!res.ok) throw new Error("INSERT: " + (await res.text()));
}

async function main() {
  console.log(`Mode: ${DRY ? "DRY-RUN (tanpa perubahan)" : "LIVE"}`);
  const files = new Set(readdirSync(PHOTO_DIR));
  const missing = MAP.filter((m) => !files.has(m.file));
  if (missing.length) { console.error("File tidak ditemukan:", missing.map((m) => m.file)); process.exit(1); }

  const { byName, maxOrder } = await getExisting();
  let order = maxOrder;
  let patched = 0, inserted = 0;

  for (const m of MAP) {
    const existing = byName.get(m.name.toLowerCase().trim());
    const isNew = !existing;
    if (isNew && !m.division) { console.error(`SKIP (butuh data insert): ${m.name}`); continue; }

    const url = DRY ? "(dry-run-url)" : await uploadToCloudinary(m.file);

    if (existing) {
      if (!DRY) await patchImage(existing.id, url);
      patched++;
      console.log(`  [PATCH] ${m.name}  <- ${m.file}`);
    } else {
      order += 1;
      if (!DRY) await insertMember(m, url, order);
      inserted++;
      console.log(`  [INSERT #${order}] ${m.name} (${m.position} / ${m.division})  <- ${m.file}`);
    }
  }
  console.log(`\nSelesai. PATCH=${patched}, INSERT=${inserted}, total=${patched + inserted}/${MAP.length}`);
}
main().catch((e) => { console.error("GAGAL:", e.message); process.exit(1); });
