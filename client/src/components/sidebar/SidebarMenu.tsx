// Server Component
import SidebarList, { MenuItem } from "./SidebarList";
import { getCombinedSidebarMenu, pickSidebarItems } from "@/app/api/combine-menu";

export const revalidate = 60;

function toMenuItems(data: any[]): MenuItem[] {
  const walk = (arr: any[]): MenuItem[] =>
    (arr || []).map((x) => ({
      id: String(x.id ?? x.idpart ?? cryptoRandom()),
      tieude: String(x.tieude ?? x.title ?? x.name ?? "Không tên"),
      url: String(x.url ?? x.slug ?? "#"),
      children: x.children ? walk(x.children) : undefined,
    }));
  return walk(data);
}

function cryptoRandom() {
  return Math.random().toString(36).slice(2);
}

export default async function SideBarMenu() {
  let items: MenuItem[] = [];

  try {
    const combined = await getCombinedSidebarMenu();
    const picked = pickSidebarItems(combined);
    items = toMenuItems(picked);
  } catch (e) {
    console.error("SideBarMenu error:", e);
  }

  // mở sẵn "Công Nghệ" nếu có
  const congNgheId =
    items.find((i) => i.tieude.toLowerCase().includes("công nghệ") || i.tieude.toLowerCase().includes("cong nghe"))
      ?.id || undefined;

  return (
    <aside className="mb-3">
      <h4 className="fw-bold fs-3 mb-2">Danh mục</h4>
      {!items.length ? (
        <p className="text-muted small m-0">Không có danh mục.</p>
      ) : (
        <SidebarList items={items} defaultOpenIds={[]}/*defaultOpenIds={congNgheId ? [congNgheId] : []}*/ />
      )}
    </aside>
  );
}
