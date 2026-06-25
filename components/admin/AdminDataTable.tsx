"use client";

import { deleteCmsItem } from "@/app/admin/actions";
import type { AdminCollectionConfig } from "@/lib/admin/collections";
import type { AdminCollectionRow } from "@/lib/admin/types";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HiArrowTopRightOnSquare,
  HiMagnifyingGlass,
  HiPencilSquare,
  HiPlus,
  HiTrash,
} from "react-icons/hi2";

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

function rowMatchesQuery(row: AdminCollectionRow, query: string) {
  if (!query) {
    return true;
  }

  const rowValues = row as unknown as Record<string, unknown>;
  const searchText = Object.values(rowValues)
    .map((value) => {
      if (value === null || value === undefined) {
        return "";
      }

      return String(value);
    })
    .join(" ")
    .toLowerCase();

  return searchText.includes(query);
}

export default function AdminDataTable({
  config,
  rows,
}: {
  config: AdminCollectionConfig;
  rows: AdminCollectionRow[];
}) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredRows = useMemo(
    () => rows.filter((row) => rowMatchesQuery(row, normalizedSearch)),
    [rows, normalizedSearch],
  );

  return (
    <section className="overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl shadow-black/15">
      <div className="grid gap-4 border-b border-slate-200 px-5 py-4 lg:grid-cols-[1fr_minmax(280px,420px)] lg:items-center">
        <div>
          <h2 className="text-xl font-black">Data {config.title}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {filteredRows.length} dari {rows.length} data ditampilkan
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <label className="relative block w-full sm:max-w-sm">
            <HiMagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari dari semua field"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#173472] focus:bg-white focus:ring-4 focus:ring-[#173472]/10"
            />
          </label>
          <Link
            href={`${config.path}?new=1`}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#173472] px-4 text-sm font-black text-[#173472] transition hover:bg-[#173472] hover:text-white"
          >
            <HiPlus className="h-5 w-5" aria-hidden="true" />
            Tambah
          </Link>
        </div>
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
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={config.columns.length + 1}
                  className="px-5 py-12 text-center text-sm font-semibold text-slate-500"
                >
                  {rows.length === 0
                    ? "Belum ada data."
                    : "Tidak ada data yang cocok dengan pencarian."}
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const rowValues = row as unknown as Record<string, unknown>;

                return (
                  <tr key={row.id} className="transition hover:bg-slate-50/80">
                    {config.columns.map((column) => (
                      <td
                        key={column.key}
                        className="max-w-[18rem] px-5 py-4 font-semibold text-slate-700"
                      >
                        {renderTableCell(rowValues[column.key], column.type)}
                      </td>
                    ))}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
