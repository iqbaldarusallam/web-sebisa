import { deleteCmsItem, saveCmsItem } from "@/app/admin/actions";
import type { AdminCollectionConfig, AdminField } from "@/lib/admin/collections";
import type { AdminCollectionRow } from "@/lib/admin/types";
import Image from "next/image";
import Link from "next/link";
import {
  HiArrowLeft,
  HiArrowTopRightOnSquare,
  HiPencilSquare,
  HiPlus,
  HiTrash,
} from "react-icons/hi2";
import CloudinaryUploadField from "./CloudinaryUploadField";

function formatValue(value: unknown, type?: string) {
  if (type === "boolean") {
    return value ? "Ya" : "Tidak";
  }

  if (type === "money" && typeof value === "number") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (type === "date" && typeof value === "string") {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

function renderTableCell(value: unknown, type?: string) {
  if (type === "image") {
    const src = typeof value === "string" ? value : "";

    if (!src) {
      return (
        <span className="inline-flex h-12 w-16 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-400">
          -
        </span>
      );
    }

    return (
      <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        <Image src={src} alt="" fill sizes="80px" className="object-contain p-1" />
      </div>
    );
  }

  if (type === "url") {
    const href = typeof value === "string" ? value : "";

    if (!href) {
      return "-";
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-full bg-[#173472]/8 px-3 py-1 text-xs font-black text-[#173472] transition hover:bg-[#173472] hover:text-white"
      >
        Buka
        <HiArrowTopRightOnSquare className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    );
  }

  if (type === "boolean") {
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
          value ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {formatValue(value, type)}
      </span>
    );
  }

  return <span className="line-clamp-2">{formatValue(value, type)}</span>;
}

function AdminInput({
  field,
  collectionKey,
  value,
}: {
  field: AdminField;
  collectionKey: string;
  value?: unknown;
}) {
  const baseClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#173472] focus:ring-4 focus:ring-[#173472]/10";
  const inputValue = value === null || value === undefined ? "" : String(value);

  if (field.name === "imageUrl" || field.name === "logoUrl") {
    return (
      <CloudinaryUploadField
        name={field.name}
        required={field.required}
        placeholder={field.placeholder}
        collectionKey={collectionKey}
        defaultValue={inputValue}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        name={field.name}
        required={field.required}
        placeholder={field.placeholder}
        rows={4}
        defaultValue={inputValue}
        className={baseClass}
      />
    );
  }

  if (field.type === "checkbox") {
    const defaultChecked =
      value === undefined || value === null ? true : Boolean(value);

    return (
      <label className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={defaultChecked}
          className="h-4 w-4 accent-[#20C4E8]"
        />
        Aktifkan {field.label.toLowerCase()}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <select
        name={field.name}
        required={field.required}
        defaultValue={inputValue}
        className={baseClass}
      >
        {(field.options ?? []).map((option) => (
          <option key={option} value={option} className="bg-white text-slate-900">
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.type}
      name={field.name}
      required={field.required}
      placeholder={field.placeholder}
      defaultValue={inputValue}
      className={baseClass}
    />
  );
}

export default function AdminCollectionPage({
  config,
  rows,
  saved,
  deleted,
  supabaseConfigured,
  editId,
  isCreating = false,
}: {
  config: AdminCollectionConfig;
  rows: AdminCollectionRow[];
  saved?: string;
  deleted?: string;
  supabaseConfigured: boolean;
  editId?: string;
  isCreating?: boolean;
}) {
  const editRow = editId ? rows.find((row) => row.id === editId) : undefined;
  const showForm = isCreating || Boolean(editRow);
  const formTitle = editRow ? `Edit ${config.title}` : `Tambah ${config.title}`;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#20C4E8]">
            {config.badge}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
            {showForm ? formTitle : config.title}
          </h1>
        </div>

        {showForm ? (
          <Link
            href={config.path}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/12 px-4 text-sm font-black text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            <HiArrowLeft className="h-5 w-5" aria-hidden="true" />
            Kembali
          </Link>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2">
              <span className="text-xl font-black text-white">{rows.length}</span>
              <span className="ml-2 text-xs font-bold text-white/48">data</span>
            </div>
            <Link
              href={`${config.path}?new=1`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#20C4E8] px-4 text-sm font-black text-[#041B38] transition hover:bg-[#67E8F9]"
            >
              <HiPlus className="h-5 w-5" aria-hidden="true" />
              Tambah Data
            </Link>
          </div>
        )}
      </section>

      {saved ? (
        <div className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-4 py-3 text-sm font-bold text-[#86EFAC]">
          {saved === "demo"
            ? "Data belum tersimpan permanen."
            : "Data berhasil disimpan."}
        </div>
      ) : null}
      {deleted ? (
        <div className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-4 py-3 text-sm font-bold text-[#86EFAC]">
          {deleted === "demo"
            ? "Data asli belum berubah."
            : "Data berhasil dihapus."}
        </div>
      ) : null}
      {!supabaseConfigured ? (
        <div className="rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/10 px-4 py-3 text-sm font-bold text-[#FCD34D]">
          Penyimpanan belum aktif. Perubahan belum tersimpan permanen.
        </div>
      ) : null}

      {showForm ? (
        <section className="max-w-4xl rounded-2xl bg-white p-6 text-slate-900 shadow-xl shadow-black/15">
          <form action={saveCmsItem}>
            <input type="hidden" name="collection" value={config.key} />
            {editRow ? <input type="hidden" name="id" value={editRow.id} /> : null}

            <div className="grid gap-5 md:grid-cols-2">
              {config.fields.map((field) => (
                <label
                  key={field.name}
                  className={field.type === "textarea" ? "block md:col-span-2" : "block"}
                >
                  <span className="text-sm font-black text-slate-700">
                    {field.label}
                  </span>
                  <AdminInput
                    field={field}
                    collectionKey={config.key}
                    value={
                      editRow
                        ? (editRow as unknown as Record<string, unknown>)[field.name]
                        : undefined
                    }
                  />
                </label>
              ))}
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href={config.path}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-black text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </Link>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#173472] px-6 text-sm font-black text-white transition hover:bg-[#0F2554]"
              >
                {editRow ? "Update Data" : "Simpan Data"}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl shadow-black/15">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black">Data {config.title}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {rows.length} data tersimpan
            </p>
          </div>
          <Link
            href={`${config.path}?new=1`}
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
                  {config.columns.map((column) => (
                    <th key={column.key} className="px-5 py-3.5 font-black">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-5 py-3.5 font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={config.columns.length + 1}
                      className="px-5 py-12 text-center text-sm font-semibold text-slate-500"
                    >
                      Belum ada data.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="transition hover:bg-slate-50/80">
                    {config.columns.map((column) => {
                      const value = (row as unknown as Record<string, unknown>)[column.key];

                      return (
                        <td key={column.key} className="max-w-[18rem] px-5 py-4 font-semibold text-slate-700">
                          {renderTableCell(value, column.type)}
                        </td>
                      );
                    })}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`${config.path}?edit=${row.id}`}
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-black text-[#173472] transition hover:bg-[#173472]/8"
                        >
                          <HiPencilSquare className="h-4 w-4" aria-hidden="true" />
                          Edit
                        </Link>
                        <form action={deleteCmsItem}>
                          <input type="hidden" name="collection" value={config.key} />
                          <input type="hidden" name="id" value={row.id} />
                          <button
                            type="submit"
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-black text-red-600 transition hover:bg-red-50"
                          >
                            <HiTrash className="h-4 w-4" aria-hidden="true" />
                            Hapus
                          </button>
                        </form>
                      </div>
                    </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
