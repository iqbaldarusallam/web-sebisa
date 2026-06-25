import { deleteAdminAccount, saveAdminAccount } from "@/app/admin/actions";
import { requireSuperAdminSession } from "@/lib/admin/auth";
import { getAdminUsers } from "@/lib/admin/data";
import type { AdminUser } from "@/lib/admin/types";
import type { Metadata } from "next";
import Link from "next/link";
import {
  HiArrowLeft,
  HiPencilSquare,
  HiPlus,
  HiTrash,
} from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Manajemen Admin | Sebisa Project",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function RoleBadge({ role }: { role: string }) {
  const isSuperAdmin = role === "super_admin";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
        isSuperAdmin
          ? "bg-[#20C4E8]/10 text-[#0E7490]"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {isSuperAdmin ? "Super Admin" : "Admin"}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

function AdminAvatar({ admin }: { admin: AdminUser }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#20C4E8] text-sm font-black text-[#041B38]">
      {getInitials(admin.name) || "A"}
    </span>
  );
}

function ErrorMessage({ code }: { code?: string }) {
  const message =
    code === "protected"
      ? "Akun super admin dan akun yang sedang dipakai tidak bisa diubah dari manajemen admin."
      : code === "password-required"
        ? "Password awal wajib diisi saat membuat admin baru."
        : code === "invalid"
          ? "Nama dan email admin wajib diisi."
          : null;

  if (!message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
      {message}
    </div>
  );
}

function AdminForm({
  admin,
  isCreating,
}: {
  admin?: AdminUser;
  isCreating: boolean;
}) {
  return (
    <section className="max-w-4xl rounded-2xl bg-white p-6 text-slate-900 shadow-xl shadow-black/15">
      <form action={saveAdminAccount}>
        {admin ? <input type="hidden" name="id" value={admin.id} /> : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-black text-slate-700">Nama Admin</span>
            <input
              name="name"
              required
              defaultValue={admin?.name ?? ""}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#173472] focus:ring-4 focus:ring-[#173472]/10"
            />
          </label>
          <label className="block">
            <span className="text-sm font-black text-slate-700">Email</span>
            <input
              name="email"
              type="email"
              required
              defaultValue={admin?.email ?? ""}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#173472] focus:ring-4 focus:ring-[#173472]/10"
            />
          </label>
          {isCreating ? (
            <label className="block">
              <span className="text-sm font-black text-slate-700">Password Awal</span>
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#173472] focus:ring-4 focus:ring-[#173472]/10"
              />
            </label>
          ) : null}
          <label className="block">
            <span className="text-sm font-black text-slate-700">Role</span>
            <div className="mt-2 flex min-h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
              <RoleBadge role="admin" />
            </div>
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 md:col-span-2">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={admin?.isActive ?? true}
              className="h-4 w-4 accent-[#20C4E8]"
            />
            Admin aktif
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/admins"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-black text-slate-600 transition hover:bg-slate-50"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#173472] px-6 text-sm font-black text-white transition hover:bg-[#0F2554]"
          >
            {isCreating ? "Simpan Admin" : "Update Admin"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    deleted?: string;
    error?: string;
    edit?: string;
    new?: string;
  }>;
}) {
  const session = await requireSuperAdminSession();
  const params = await searchParams;
  const admins = await getAdminUsers();
  const editableAdmins = admins.filter(
    (admin) => admin.role !== "super_admin" && admin.id !== session.id,
  );
  const editAdmin = params.edit
    ? editableAdmins.find((admin) => admin.id === params.edit)
    : undefined;
  const isCreating = params.new === "1";
  const showForm = isCreating || Boolean(editAdmin);
  const formTitle = editAdmin ? "Edit Admin" : "Tambah Admin";

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#20C4E8]">
            Super Admin
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
            {showForm ? formTitle : "Manajemen Admin"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/58">
            Role admin baru selalu Admin. Akun super admin utama tidak diedit dari halaman ini.
          </p>
        </div>

        {showForm ? (
          <Link
            href="/admin/admins"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/12 px-4 text-sm font-black text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            <HiArrowLeft className="h-5 w-5" aria-hidden="true" />
            Kembali
          </Link>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2">
              <span className="text-xl font-black text-white">{admins.length}</span>
              <span className="ml-2 text-xs font-bold text-white/48">akun</span>
            </div>
            <Link
              href="/admin/admins?new=1"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#20C4E8] px-4 text-sm font-black text-[#041B38] transition hover:bg-[#67E8F9]"
            >
              <HiPlus className="h-5 w-5" aria-hidden="true" />
              Tambah Data
            </Link>
          </div>
        )}
      </section>

      {params.saved ? (
        <div className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-4 py-3 text-sm font-bold text-[#86EFAC]">
          Data admin berhasil disimpan.
        </div>
      ) : null}
      {params.deleted ? (
        <div className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-4 py-3 text-sm font-bold text-[#86EFAC]">
          Admin berhasil dihapus.
        </div>
      ) : null}
      <ErrorMessage code={params.error} />

      {showForm ? (
        <AdminForm admin={editAdmin} isCreating={isCreating} />
      ) : (
        <section className="overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl shadow-black/15">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">Data Admin</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {admins.length} akun terdaftar
              </p>
            </div>
            <Link
              href="/admin/admins?new=1"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#173472] px-4 text-sm font-black text-[#173472] transition hover:bg-[#173472] hover:text-white"
            >
              <HiPlus className="h-5 w-5" aria-hidden="true" />
              Tambah
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-black">Admin</th>
                  <th className="px-5 py-3.5 font-black">Role</th>
                  <th className="px-5 py-3.5 font-black">Status</th>
                  <th className="px-5 py-3.5 font-black">Dibuat</th>
                  <th className="px-5 py-3.5 font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {admins.map((admin) => {
                  const isSuperAdmin = admin.role === "super_admin";
                  const isSelf = admin.id === session.id;

                  return (
                    <tr key={admin.id} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <AdminAvatar admin={admin} />
                          <div>
                            <p className="font-black text-slate-900">{admin.name}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <RoleBadge role={admin.role} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge active={admin.isActive} />
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-600">
                        {formatDate(admin.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        {isSuperAdmin ? (
                          <span className="inline-flex min-h-9 items-center rounded-lg px-2.5 text-xs font-black text-slate-400">
                            Akun utama
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/admin/admins?edit=${admin.id}`}
                              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-black text-[#173472] transition hover:bg-[#173472]/8"
                            >
                              <HiPencilSquare className="h-4 w-4" aria-hidden="true" />
                              Edit
                            </Link>
                            <form action={deleteAdminAccount}>
                              <input type="hidden" name="id" value={admin.id} />
                              <button
                                type="submit"
                                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                                disabled={isSelf}
                              >
                                <HiTrash className="h-4 w-4" aria-hidden="true" />
                                Hapus
                              </button>
                            </form>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
