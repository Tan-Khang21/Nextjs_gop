"use client";

import SpinAnimation from "@/components/items/SpinAnimation";
import NewsPage from "@/components/news/NewsPage";
import ProductContainer from "@/components/products/ProductContainer";
import ContactForm from "@/components/users/ContactForm";

export default function RenderPageContent({
  module,
  id,
}: {
  module: string;
  id: string;
}) {
  if (id) {
    switch (module) {
      case "sanpham":
        return <ProductContainer id={id} />;
      case "tintuc":
        return <NewsPage id={id} />;
      case "lienhe":
        return <ContactForm id={id} />;
      default:
        return <SpinAnimation />;
    }
  }
}
