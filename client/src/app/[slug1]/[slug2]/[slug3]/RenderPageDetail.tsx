/*import NewsDetail from "@/components/news/NewsDetail";
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
}*/

import React from "react";
import NewsDetail from "@/components/news/NewsDetail";
import ProductDetail from "@/components/products/ProductDetail";

type Props = {
  module: string;   // slug1
  slug2?: string;   // slug chuyên mục (nếu có)
  slug3?: string;   // id/slug bài viết (nếu có)
};

export default function RenderPageDetail({ module }: Props) {
  switch ((module || "").toLowerCase()) {
    case "tintuc":
      // NewsDetail tự đọc params bằng useParams, đồng thời đã gọi "Tin liên quan"
      return <NewsDetail />;
    case "sanpham":
      return <ProductDetail />;

    default:
      // fallback nhẹ nhàng – có thể thay thế bằng 404 friendly page nếu cần
      /*return (
        <section className="container py-5">
          <h1 className="h5">Không tìm thấy nội dung</h1>
          <p className="text-muted mb-0">
            Vui lòng kiểm tra lại đường dẫn hoặc quay về trang trước.
          </p>
        </section>
      );*/
      return null;
  }
}

