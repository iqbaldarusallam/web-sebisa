"use client";

import { useRef, useState } from "react";
import { HiArrowUpTray, HiCheckCircle, HiExclamationTriangle } from "react-icons/hi2";

type SignatureResponse = {
  ok: boolean;
  message?: string;
  cloudName?: string;
  apiKey?: string;
  folder?: string;
  timestamp?: number;
  signature?: string;
};

type UploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

function resolveFolder(fieldName: string, collectionKey?: string) {
  if (collectionKey === "team") {
    return "sebisa/team";
  }

  if (fieldName === "logoUrl") {
    return "sebisa/clients";
  }

  if (fieldName === "imageUrl") {
    return "sebisa/portfolio";
  }

  return "sebisa/portfolio";
}

export default function CloudinaryUploadField({
  name,
  placeholder,
  required,
  collectionKey,
  defaultValue = "",
}: {
  name: string;
  placeholder?: string;
  required?: boolean;
  collectionKey?: string;
  defaultValue?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleFileChange(file: File | null) {
    if (!file) {
      return;
    }

    setStatus("uploading");
    setMessage("");

    try {
      const signatureResponse = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: resolveFolder(name, collectionKey) }),
      });
      const signature = (await signatureResponse.json()) as SignatureResponse;

      if (!signatureResponse.ok || !signature.ok) {
        throw new Error("Fitur upload gambar belum siap.");
      }

      const uploadData = new FormData();
      uploadData.set("file", file);
      uploadData.set("api_key", signature.apiKey ?? "");
      uploadData.set("timestamp", String(signature.timestamp ?? ""));
      uploadData.set("signature", signature.signature ?? "");
      uploadData.set("folder", signature.folder ?? resolveFolder(name, collectionKey));

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`,
        {
          method: "POST",
          body: uploadData,
        },
      );
      const upload = (await uploadResponse.json()) as UploadResponse;

      if (!uploadResponse.ok || !upload.secure_url) {
        throw new Error(upload.error?.message || "Upload gambar gagal.");
      }

      setValue(upload.secure_url);
      setStatus("success");
      setMessage("Upload berhasil. URL sudah masuk ke form.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Upload gagal.");
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="mt-2 space-y-3">
      <input
        type="url"
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#173472] focus:ring-4 focus:ring-[#173472]/10"
      />
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          disabled={status === "uploading"}
          onClick={() => inputRef.current?.click()}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#173472]/20 bg-[#173472]/8 px-4 text-xs font-black text-[#173472] transition hover:bg-[#173472] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <HiArrowUpTray className="h-4 w-4" aria-hidden="true" />
          {status === "uploading" ? "Mengupload..." : "Upload Gambar"}
        </button>
        {status === "success" || status === "error" ? (
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold ${
              status === "success" ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {status === "success" ? (
              <HiCheckCircle className="h-4 w-4" aria-hidden="true" />
            ) : (
              <HiExclamationTriangle className="h-4 w-4" aria-hidden="true" />
            )}
            {message}
          </span>
        ) : null}
      </div>
    </div>
  );
}
