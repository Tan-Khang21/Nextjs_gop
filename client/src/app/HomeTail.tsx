"use client";

import { usePathname } from "next/navigation";
import RenderHome from "./RenderHome";

/** Chỉ render các section của trang chủ khi đang ở "/" */
export default function HomeTail() {
  const pathname = usePathname();
  if (pathname !== "/") return null;  // không phải trang chủ => ẩn hẳn
  return <RenderHome />;
}
