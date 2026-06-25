"use client";

import { useState } from "react";

const badgeOptions = [
  {
    value: "discount",
    label: "Hemat otomatis",
    description: "Menghitung dari harga normal dan harga promo.",
  },
  {
    value: "popular",
    label: "Popular",
    description: "Maksimal satu layanan per kategori.",
  },
  {
    value: "custom",
    label: "Isi sendiri",
    description: "Tampilkan teks badge sesuai kebutuhan.",
  },
];

export default function AdminBadgeField({
  defaultText = "",
  defaultType = "discount",
  placeholder,
}: {
  defaultText?: string;
  defaultType?: string;
  placeholder?: string;
}) {
  const [badgeType, setBadgeType] = useState(defaultType || "discount");
  const showCustomInput = badgeType === "custom";

  return (
    <div className="mt-2 space-y-3">
      <select
        name="badgeType"
        value={badgeType}
        onChange={(event) => setBadgeType(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#173472] focus:ring-4 focus:ring-[#173472]/10"
      >
        {badgeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <p className="text-xs font-semibold leading-5 text-slate-500">
        {badgeOptions.find((option) => option.value === badgeType)?.description}
      </p>

      {showCustomInput ? (
        <input
          type="text"
          name="badgeText"
          defaultValue={defaultText}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#173472] focus:ring-4 focus:ring-[#173472]/10"
        />
      ) : (
        <input type="hidden" name="badgeText" value="" />
      )}
    </div>
  );
}
