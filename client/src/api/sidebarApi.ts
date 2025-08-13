// client/src/api/sidebarApi.ts
export type RawMenuItem = {
  id?: string | number;
  idpart?: string;
  idquanly?: string;
  tieude?: string;
  title?: string;
  name?: string;
  url?: string;
  menucap1?: RawMenuItem[];
  children?: RawMenuItem[];
  // ... các key khác có thể xuất hiện
};

export type Category = {
  id: string;
  tieude: string;
  url: string;               // slug/path
  children?: Category[];     // cấp con (nếu có)
};

async function fetchSafe(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  const ct = res.headers.get("content-type") || "";

  // đọc text để debug khi lỗi
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Fetch ${url} failed: ${res.status} ${text.slice(0, 200)}`);
  }

  // Nếu đúng JSON
  if (ct.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Invalid JSON from ${url}: ${String(e)} | preview: ${text.slice(0, 200)}`);
    }
  }

  // Nếu server trả text nhưng thực chất là JSON -> thử parse
  try {
    const trimmed = text.replace(/^\uFEFF/, "").trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      return JSON.parse(trimmed);
    }
  } catch {
    /* ignore */
  }

  // Không phải JSON -> ném lỗi rõ ràng để UI không crash
  throw new Error(`Expected JSON from ${url} but got "${ct}". Preview: ${text.slice(0, 200)}`);
}

export async function fetchLeftMenuRaw(): Promise<RawMenuItem[] | { data: RawMenuItem[] }> {
  const url = "https://demodienmay.125.atoz.vn/ww2/web.vitritrai.asp";
  return fetchSafe(url);
}

export async function fetchTopMenuRaw(): Promise<RawMenuItem[] | { data: RawMenuItem[] }> {
  const url = "https://demodienmay.125.atoz.vn/ww2/app.menu.dautrang.asp";
  return fetchSafe(url);
}
