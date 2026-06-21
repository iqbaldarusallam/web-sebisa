const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseAdminEnv() {
  return Boolean(supabaseUrl && supabasePublishableKey && supabaseServiceKey);
}

function assertSupabaseEnv() {
  if (!supabaseUrl || !supabasePublishableKey || !supabaseServiceKey) {
    throw new Error("Supabase admin environment variables are not configured.");
  }
}

function getHeaders(extra?: HeadersInit) {
  assertSupabaseEnv();

  return {
    apikey: supabasePublishableKey as string,
    Authorization: `Bearer ${supabaseServiceKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase request failed with ${response.status}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

export async function supabaseSelect<T>(
  table: string,
  query = "select=*&order=sort_order.asc",
) {
  assertSupabaseEnv();

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: getHeaders(),
    cache: "no-store",
  });

  return parseJson<T[]>(response);
}

export async function supabaseInsert<T>(table: string, payload: Record<string, unknown>) {
  assertSupabaseEnv();

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: getHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const rows = await parseJson<T[]>(response);
  return rows[0] ?? null;
}

export async function supabaseUpdate<T>(
  table: string,
  id: string,
  payload: Record<string, unknown>,
) {
  assertSupabaseEnv();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${table}?id=eq.${id}`,
    {
      method: "PATCH",
      headers: getHeaders({ Prefer: "return=representation" }),
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  const rows = await parseJson<T[]>(response);
  return rows[0] ?? null;
}

export async function supabaseUpdateWhere<T>(
  table: string,
  column: string,
  value: string,
  payload: Record<string, unknown>,
) {
  assertSupabaseEnv();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`,
    {
      method: "PATCH",
      headers: getHeaders({ Prefer: "return=representation" }),
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  const rows = await parseJson<T[]>(response);
  return rows[0] ?? null;
}

export async function supabaseDelete(table: string, id: string) {
  assertSupabaseEnv();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${table}?id=eq.${id}`,
    {
      method: "DELETE",
      headers: getHeaders({ Prefer: "return=minimal" }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase delete failed with ${response.status}`);
  }

  return true;
}
