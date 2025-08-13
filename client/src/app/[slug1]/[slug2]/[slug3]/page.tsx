import React from "react";
import RenderPageDetail from "./RenderPageDetail";

export default async function page({ params }: { params: { slug1: string } }) {
  const { slug1 } = await params;

  return <RenderPageDetail module={slug1} />

}
