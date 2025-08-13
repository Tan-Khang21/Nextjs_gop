/*import React from "react";
import RenderPageDetail from "./RenderPageDetail";

export default async function page({ params }: { params: { slug1: string } }) {
  const { slug1 } = await params;

  return <RenderPageDetail module={slug1} />

}*/
import RenderPageDetail from "./RenderPageDetail";

export const revalidate = 120;

type PageProps = {
  params: {
    slug1: string;
    slug2?: string;
    slug3?: string; // thường là id/slug bài viết
  };
};

export default function Page({ params }: PageProps) {
  const { slug1, slug2 = "", slug3 = "" } = params;

  // Truyền đầy đủ xuống RenderPageDetail để module detail (tin tức/sản phẩm) dùng khi cần
  return <RenderPageDetail module={slug1} slug2={slug2} slug3={slug3} />;
}

