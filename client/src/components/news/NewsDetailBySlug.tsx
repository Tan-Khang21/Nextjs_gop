"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import RelatedPager from "./RelatedPager";

// Chỉ còn findNewsBySlug + type
import { findNewsBySlug, LightNews } from "../../app/api/news";

function getSingleSlugFromParams(params: Record<string, unknown>) {
  const val = Object.values(params)[0] as string | string[] | undefined;
  if (Array.isArray(val)) return val[0] ?? "";
  return val ?? "";
}

function titleFromSlug(slug: string) {
  return decodeURIComponent(slug.replace(/-/g, " ").replace(/\s+/g, " ").trim());
}
function formatDate(v?: string) {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : d.toLocaleDateString("vi-VN");
}

export default function NewsDetailBySlug() {
  const params = useParams() as Record<string, unknown>;
  const slug = useMemo(() => getSingleSlugFromParams(params), [params]);

  const [current, setCurrent] = useState<LightNews | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (!slug) return;
      setLoading(true);

      // Tìm bài theo slug trong list
      const item = await findNewsBySlug(slug);
      if (!alive) return;

      if (item) {
        setCurrent(item);
      } else {
        // Không tìm thấy -> vẫn hiển thị tiêu đề từ slug
        setCurrent({ id: "", url: slug, tieude: titleFromSlug(slug) });
      }

      setLoading(false);
    }
    run();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return <section className="container py-5 text-muted">Đang tải bài viết...</section>;
  }
  if (!current) {
    return <section className="container py-5">Không tìm thấy bài viết.</section>;
  }

  return (
    <section className="container py-4">
      <article className="mb-5">
        <header className="mb-3">
          <h1 className="h3 fw-bold">{current.tieude || titleFromSlug(slug)}</h1>
          {current.ngaydang ? (
            <div className="text-muted small">Ngày đăng: {formatDate(current.ngaydang)}</div>
          ) : null}
        </header>

        {current.hinhdaidien ? (
          <div className="mb-3 border p-2 text-center bg-white">
            <Image
              src={current.hinhdaidien}
              alt={current.tieude || "Hình đại diện"}
              width={900}
              height={540}
              className="img-fluid rounded"
            />
          </div>
        ) : (
          <div className="bg-light border rounded p-5 text-center text-muted mb-3">
            Chưa có ảnh đại diện (bài không có hinhdaidien trong list).
          </div>
        )}

        <h5 className="border-bottom border-2 border-success fw-semibold text-success mb-3">
          TIN CHI TIẾT
        </h5>
        <div className="bg-white p-3 border rounded">
          <div className="productDescription">
            {/* Không có endpoint chi tiết HTML → hiển thị tóm tắt nếu có */}
            {current.noidungtomtat ? (
              <div dangerouslySetInnerHTML={{ __html: current.noidungtomtat }} />
            ) : (
              <em className="text-muted">Chưa có nội dung chi tiết (không có API chi tiết).</em>
            )}
          </div>
        </div>
      </article>

      {/* Chỉ còn 1 block Tin liên quan với phân trang */}
      {current.id ? (
        <RelatedPager newsId={current.id} initialPage={1} pageSize={30} />
      ) : null}
    </section>
  );
}
