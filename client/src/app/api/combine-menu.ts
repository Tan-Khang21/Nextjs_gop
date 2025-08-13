// client/src/app/combine-menu.ts
import type { Category, RawMenuItem } from "@/api/sidebarApi";
import { fetchLeftMenuRaw, fetchTopMenuRaw } from "@/api/sidebarApi";

/** Lấy mảng item từ dạng { data: [] } hoặc [] */
function unwrap(data: any): RawMenuItem[] {
  if (!data) return [];

  // TH1: API trả mảng item
  if (Array.isArray(data)) return data as RawMenuItem[];

  // TH2: { data: [...] }
  if (Array.isArray(data?.data)) return data.data as RawMenuItem[];

  // TH3: { noidung: [...] }  (web.vitritrai.asp)
  if (Array.isArray(data?.noidung)) return data.noidung as RawMenuItem[];

  // TH4: object đơn có 'tenham' & 'noidung'
  if (data?.tenham && Array.isArray(data?.noidung)) {
    return data.noidung as RawMenuItem[];
  }

  // TH5 (fallback): lấy field đầu tiên là array chứa object có tieude/url
  for (const k of Object.keys(data)) {
    const v = (data as any)[k];
    if (
      Array.isArray(v) &&
      v.some((x: any) => x && typeof x === "object" && ("tieude" in x || "url" in x))
    ) {
      return v as RawMenuItem[];
    }
  }

  return [];
}

function normalize(item: any): Category {
  const id =
    item?.id ??
    item?.idpart ??
    item?.idquanly ??
    item?.ID ??
    item?.Id ??
    // fallback tránh trùng
    `${(item?.url ?? item?.tieude ?? Math.random().toString()).toString()}-${Math.random().toString(36).slice(2)}`;

  const title = item?.tieude ?? item?.title ?? item?.name ?? "Không tên";
  const url = cleanUrl(item?.url ?? item?.slug ?? "#");

  // map children/menucap1 nếu có
  const rawChildren: RawMenuItem[] = Array.isArray(item?.children)
    ? item.children
    : Array.isArray(item?.menucap1)
    ? item.menucap1
    : [];

  return {
    id: String(id),
    tieude: String(title),
    url,
    children: rawChildren.length ? rawChildren.map(normalize) : undefined,
  };
}

function cleanUrl(u?: string) {
  if (!u) return "#";
  return String(u).replace(/^https?:\/\/[^/]+/i, "").replace(/^\/*/, ""); // thành relative path
}

function mergeById(list: Category[]): Category[] {
  const map = new Map<string, Category>();
  for (const c of list) {
    const cur = map.get(c.id);
    if (!cur) {
      map.set(c.id, { ...c, children: c.children ? [...c.children] : undefined });
    } else {
      // hợp nhất thông tin
      cur.tieude ||= c.tieude;
      cur.url ||= c.url;

      const kids = [...(cur.children ?? []), ...(c.children ?? [])];
      cur.children = kids.length ? dedupById(kids) : undefined;
    }
  }
  return Array.from(map.values());
}

function dedupById(items: Category[]) {
  const seen = new Set<string>();
  const out: Category[] = [];
  for (const it of items) {
    if (!seen.has(it.id)) {
      seen.add(it.id);
      out.push(it);
    }
  }
  return out;
}

/** API public: gọi 2 endpoint và trả Category[] đã gộp */
export async function getCombinedSidebarMenu(): Promise<Category[]> {
  const [leftRaw, topRaw] = await Promise.all([fetchLeftMenuRaw(), fetchTopMenuRaw()]);

  // leftRaw là một MẢNG block; cần rút riêng noidung của block 'danhmucmenu'
  const leftBlocks = Array.isArray(leftRaw) ? leftRaw : unwrap(leftRaw);
  const leftMenuItems =
    leftBlocks
      .filter((b: any) => Array.isArray(b?.noidung) || b?.tenham === "danhmucmenu")
      .flatMap((b: any) => Array.isArray(b?.noidung) ? b.noidung : [])
      .map(normalize); // → chứa 'Đăng ký', 'Khoa học', 'Công nghệ' (tin-cong-nghe)

  // topRaw là mảng item; 'Công nghệ' có menucap1 (AI/Chuyển đổi số/…)
  const topItems = unwrap(topRaw).map(normalize);

  // Gộp & hợp nhất theo id
  return mergeById([...leftMenuItems, ...topItems]);
}


// --- helper: normalize tiêu đề để so khớp không dấu/không phân biệt hoa thường
/*function normalizeTitle(s?: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function ensureLeadingSlash(u?: string) {
  if (!u) return "#";
  return u.startsWith("/") ? u : `/${u}`;
}*/

/**
 * Lọc chỉ giữ:
 * - Đăng Ký
 * - Khoa học
 * - Công Nghệ (chỉ có đúng 1 mục con: AI)
 *
 * Dựa trên tiêu đề (đã normalize).
 */
// --- helpers ---
// replace nguyên hàm normalize trong combine-menu.ts
function normalizeTitle(item: any): Category {
  const id =
    item?.id ?? item?.idpart ?? item?.idquanly ?? item?.ID ?? item?.Id ??
    `${(item?.url ?? item?.tieude ?? Math.random().toString()).toString()}-${Math.random().toString(36).slice(2)}`;

  const title = item?.tieude ?? item?.title ?? item?.name ?? "Không tên";
  const url = cleanUrl(item?.url ?? item?.slug ?? "#");

  // ✅ nhận children từ nhiều khóa
  const rawChildren: RawMenuItem[] =
    Array.isArray(item?.children)   ? item.children   :
    Array.isArray(item?.menucap1)   ? item.menucap1   :
    Array.isArray(item?.noidung)    ? item.noidung    :   // ← from web.vitritrai.asp
    Array.isArray(item?.noidungtab) ? item.noidungtab :   // ← dự phòng
    [];

  return {
    id: String(id),
    tieude: String(title),
    url,
    children: rawChildren.length ? rawChildren.map(normalize) : undefined,
  };
}


function normalizeSlug(s?: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/^\/+/, "")
    .trim();
}
function ensureLeadingSlash(u?: string) {
  if (!u) return "#";
  return u.startsWith("/") ? u : `/${u}`;
}

// Tìm theo tiêu đề và/hoặc slug (kể cả ở cấp con)
function findItem(list: Category[], options: { titles?: string[]; slugs?: string[] }) {
  const titleKeys = (options.titles ?? []).map(normalizeTitle);
  const slugKeys  = (options.slugs  ?? []).map(normalizeSlug);

  const flat: Category[] = [];
  (function walk(items: Category[]) {
    for (const it of items) {
      flat.push(it);
      if (it.children?.length) walk(it.children);
    }
  })(list);

  return flat.find((it) => {
    const t = normalizeTitle(it.tieude);
    const u = normalizeSlug(it.url);
    return (titleKeys.length && titleKeys.includes(t)) || (slugKeys.length && slugKeys.includes(u));
  });
}

// --- chọn mục cần hiển thị ---
export function pickSidebarItems(all: Category[]): Category[] {
  const out: Category[] = [];

  // 1) Đăng Ký  → url: "dang-ky-thanh-vien"
  const dangKy = findItem(all, {
    titles: ["đăng ký", "dang ky"],
    slugs:  ["dang-ky", "dang-ky-thanh-vien"],
  });
  if (dangKy) {
    out.push({ id: dangKy.id, tieude: "Đăng Ký", url: ensureLeadingSlash(dangKy.url) });
  }

  // 2) Khoa học  → url: "khoa-hoc"
  const khoaHoc = findItem(all, {
    titles: ["khoa học", "khoa hoc"],
    slugs:  ["khoa-hoc"],
  });
  if (khoaHoc) {
    out.push({ id: khoaHoc.id, tieude: "Khoa học", url: ensureLeadingSlash(khoaHoc.url) });
  }

  // 3) Công Nghệ (url: "tin-cong-nghe") + 4 mục con
  const congNghe = findItem(all, {
    titles: ["công nghệ", "cong nghe"],
    slugs:  ["cong-nghe", "tin-cong-nghe"],
  });

  if (congNghe) {
    // Ưu tiên tìm trong chính children của "Công Nghệ"; nếu thiếu, tìm toàn cục
    const findChild = (titles: string[], slugs: string[]) =>
      (congNghe.children ?? []).find((c) => {
        const t = normalizeTitle(c.tieude);
        const u = normalizeSlug(c.url);
        return titles.map(normalizeTitle).includes(t) || slugs.map(normalizeSlug).includes(u);
      }) || findItem(all, { titles, slugs });

    const ai = findChild(["ai"], ["ai", "tin-tuc-tri-tue-nhan-tao-ai"]); // alias theo JSON thật
    const chuyenDoiSo = findChild(["chuyển đổi số", "chuyen doi so"], ["chuyen-doi-so"]);
    const nhipSongSo  = findChild(["nhịp sống số", "nhip song so"], ["nhip-song-so"]);
    const thietBi     = findChild(["thiết bị", "thiet bi"], ["thiet-bi"]);

    const children = [ai, chuyenDoiSo, nhipSongSo, thietBi]
      .filter(Boolean)
      .map((c) => ({
        id: (c as Category).id,
        tieude: (c as Category).tieude,
        url: ensureLeadingSlash((c as Category).url),
      }));

    out.push({
      id: congNghe.id,
      tieude: "Công Nghệ",
      url: ensureLeadingSlash(congNghe.url),
      children: children.length ? children : undefined,
    });
  }

  // 4) Liên hệ  → có thể là "lienhe"
  const lienHe = findItem(all, {
    titles: ["liên hệ", "lien he", "lienhe", "contact"],
    slugs:  ["lien-he", "lienhe", "contact"],
  });
  if (lienHe) {
    out.push({ id: lienHe.id, tieude: "Liên hệ", url: ensureLeadingSlash(lienHe.url) });
  }

  return out;
}
