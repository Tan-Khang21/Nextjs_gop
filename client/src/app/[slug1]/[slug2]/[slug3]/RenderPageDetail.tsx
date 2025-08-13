import NewsDetail from "@/components/news/NewsDetail";
import ProductDetail from "@/components/products/ProductDetail";
import React from "react";

export default function RenderPageDetail({ module }: { module: string }) {
  switch (module) {
    case "sanpham":
      return <ProductDetail />;
    case "tintuc":
      return <NewsDetail />;
    default:
      return null;
  }
}
