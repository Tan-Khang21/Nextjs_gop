import axios from "axios";

export interface SidebarItem {
  idpart: string;
  tieude: string;
  url: string;
}

export const getSidebarMenu = async (): Promise<SidebarItem[]> => {
  const res = await axios.get(
    "https://demodienmay.125.atoz.vn/ww2/web.vitritrai.asp"
  );

  const data = res.data;

  // Tìm object có `tenham: 'danhmucmenu'`
  const menuData = data.find((item: any) => item.tenham === "danhmucmenu");

  return menuData?.noidung || [];
};
