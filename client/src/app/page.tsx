// import Banner from "@/components/header/Banner";

/*import React from "react";
import RenderPageDetail from "@/app/[slug1]/[slug2]/[slug3]/RenderPageDetail";

export default function Page({
  params,
}: {
  params: { slug1: string; slug2: string; slug3: string };
}) {
  const { slug1 } = params;

  return <RenderPageDetail module={slug1} />;
}*/

import RenderHome from "./RenderHome";

export const revalidate = 60;

export default function Page() {
  return <RenderHome />;
}
