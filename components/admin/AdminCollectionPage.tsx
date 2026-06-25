import { saveCmsItem } from "@/app/admin/actions";
import type { AdminCollectionConfig, AdminField } from "@/lib/admin/collections";
import type { AdminCollectionRow } from "@/lib/admin/types";
import Link from "next/link";
import { HiArrowLeft, HiPlus } from "react-icons/hi2";
import AdminBadgeField from "./AdminBadgeField";
import AdminDataTable from "./AdminDataTable";
import CloudinaryUploadField from "./CloudinaryUploadField";

function AdminInput({
  field,
  collectionKey,
  rowValues,
  value,
}: {
  field: AdminField;
  collectionKey: string;
  rowValues?: Record<string, unknown>;
  value?: unknown;
}) {
  const baseClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#173472] focus:ring-4 focus:ring-[#173472]/10";
  const nestedClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#173472] focus:ring-4 focus:ring-[#173472]/10";
  const inputValue = value === null || value === undefined ? "" : String(value);

  if (
    field.uploadKind ||
    field.name === "imageUrl" ||
    field.name === "logoUrl"
  ) {
    return (
      <CloudinaryUploadField
        name={field.name}
        required={field.required}
        placeholder={field.placeholder}
        collectionKey={collectionKey}
        defaultValue={inputValue}
        accept={field.accept}
        mediaKind={field.uploadKind ?? "image"}
        buttonLabel={field.uploadLabel}
      />
    );
  }

  if (field.type === "badge") {
    return (
      <AdminBadgeField
        defaultType={inputValue || "discount"}
        defaultText={
          typeof rowValues?.badgeText === "string" ? rowValues.badgeText : ""
        }
        placeholder={field.customPlaceholder}
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
      value === undefined || value === null
        ? field.name === "isPublished"
        : Boolean(value);

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
    const options = field.options ?? [];
    const customValue =
      field.allowCustom && inputValue && !options.includes(inputValue)
        ? inputValue
        : "";
    const selectValue =
      inputValue && options.includes(inputValue) ? inputValue : options[0] || "";

    return (
      <div className="mt-2 space-y-3">
        <select
          name={field.name}
          required={field.required}
          defaultValue={selectValue}
          className={nestedClass}
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-white text-slate-900">
              {option}
            </option>
          ))}
        </select>
        {field.allowCustom ? (
          <input
            type="text"
            name={field.customFieldName ?? `${field.name}Custom`}
            placeholder={field.customPlaceholder}
            defaultValue={customValue}
            className={nestedClass}
          />
        ) : null}
      </div>
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
  const maxItems = config.maxItems;
  const isMaxReached = typeof maxItems === "number" && rows.length >= maxItems;
  const showForm = Boolean(editRow) || (isCreating && !isMaxReached);
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
            {isMaxReached ? (
              <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-white/45">
                Maksimal {maxItems} data
              </span>
            ) : (
              <Link
                href={`${config.path}?new=1`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#20C4E8] px-4 text-sm font-black text-[#041B38] transition hover:bg-[#67E8F9]"
              >
                <HiPlus className="h-5 w-5" aria-hidden="true" />
                Tambah Data
              </Link>
            )}
          </div>
        )}
      </section>

      {saved ? (
        <div className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-4 py-3 text-sm font-bold text-[#86EFAC]">
          {saved === "limit"
            ? `Maksimal ${maxItems ?? ""} data. Hapus atau edit data lama terlebih dahulu.`
            : saved === "demo"
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
      {isMaxReached ? (
        <div className="rounded-2xl border border-[#20C4E8]/20 bg-[#20C4E8]/10 px-4 py-3 text-sm font-bold text-[#A5F3FC]">
          Batas {config.title} adalah {maxItems} data. Data lama tetap bisa diedit atau dihapus.
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
                    rowValues={
                      editRow
                        ? (editRow as unknown as Record<string, unknown>)
                        : undefined
                    }
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
        <AdminDataTable config={config} rows={rows} />
      )}
    </div>
  );
}
