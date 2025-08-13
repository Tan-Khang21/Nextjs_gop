const BASE = "https://demodienmay.125.atoz.vn/ww2";

function buildListUrl(pageid: number, sl = 60, seedId = "45386") {
  const u = new URL(`${BASE}/module.tintuc.chitiet.lienquan.asp`);
  u.searchParams.set("id", seedId);   // id "mồi" để trả list
  u.searchParams.set("sl", String(sl));
  u.searchParams.set("pageid", String(pageid));
  return u.toString();
}

export type LightNews = {
  id: string;
  tieude: string;
  url: string;            // slug
  hinhdaidien?: string;
  ngaydang?: string;
  noidungtomtat?: string;
};

// Duyệt tối đa maxPages trang list để tìm item có url === slug
export async function findNewsBySlug(
  slug: string,
  { maxPages = 8, sl = 60, seedId = "45386" } = {}
): Promise<LightNews | null> {
  const target = (slug || "").toLowerCase().trim();

  for (let page = 1; page <= maxPages; page++) {
    const url = buildListUrl(page, sl, seedId);
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    if (!res.ok) continue;

    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      continue;
    }
    const block = Array.isArray(json) ? json[0] : null;
    const data: any[] = block?.data || [];
    const found = data.find(
      (it) => (it?.url || "").toLowerCase().trim() === target
    );
    if (found) {
      return {
        id: String(found.id),
        tieude: String(found.tieude || ""),
        url: String(found.url || ""),
        hinhdaidien: found.hinhdaidien || "",
        ngaydang: found.ngaydang || "",
        noidungtomtat: found.noidungtomtat || "",
      };
    }
  }
  return null;
}

// Tin liên quan theo id
export async function fetchRelatedNews(id: string, sl = 30, pageid = 1) {
  const u = new URL(`${BASE}/module.tintuc.chitiet.lienquan.asp`);
  u.searchParams.set("id", id);
  u.searchParams.set("sl", String(sl));
  u.searchParams.set("pageid", String(pageid));

  const res = await fetch(u.toString(), { cache: "no-store" });
  const text = await res.text();

  let json: any = [];
  try {
    json = JSON.parse(text);
  } catch {}

  const block = Array.isArray(json) ? json[0] : null;
  return {
    title: block?.tieude || "TIN LIÊN QUAN",
    items: (block?.data || []) as LightNews[],
  };
}
