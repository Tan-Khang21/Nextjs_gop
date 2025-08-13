"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNewsApi } from "../../api/contentApi"; // kiểm tra path này cho đúng

type LightNews = {
  id: string;
  tieude: string;
  url: string;
  hinhdaidien?: string;
  ngaydang?: string;
  noidungtomtat?: string;
};

interface Props {
  newsId: string;
  initialPage?: number;
  pageSize?: number;
}

export default function RelatedPager({
  newsId,
  initialPage = 1,
  pageSize = 30,
}: Props) {
  const [page, setPage] = useState<number>(initialPage);
  const [title, setTitle] = useState<string>("TIN LIÊN QUAN");
  const [items, setItems] = useState<LightNews[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevPageRef = useRef<number>(page);

  const pageCount = useMemo<number>(() => {
    if (!total || !pageSize) return 0;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  // Fetch theo page
  useEffect(() => {
    let alive = true;

    async function run() {
      if (!newsId) return;
      setLoading(true);

      const r = await getNewsApi({ id: newsId, page, sl: pageSize });
      if (!alive) return;

      const block = r?.news?.[0] as any;
      setTitle(block?.tieude || "TIN LIÊN QUAN");
      setItems((block?.data as LightNews[]) || []);
      setTotal(r?.total ?? 0);

      setLoading(false);
    }

    run();
    return () => {
      alive = false;
    };
  }, [newsId, page, pageSize]);

  // Sau khi đổi trang xong mới scroll lên đầu block
  useEffect(() => {
    if (!loading && prevPageRef.current !== page) {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      prevPageRef.current = page;
    }
  }, [loading, page]);

  if (!newsId) return null;

  // Tạo dãy trang hiển thị: 1..4 rồi …
  const visibleCount = Math.min(4, pageCount);
  const pages = Array.from({ length: visibleCount }, (_, i) => i + 1);

  return (
    <section className="py-4" ref={containerRef}>
      <h6 className="fw-bold text-success border-bottom border-3 border-success">
        {(title || "TIN LIÊN QUAN").toUpperCase()}
      </h6>

      {loading && items.length === 0 ? (
        <div className="text-muted">Đang tải...</div>
      ) : (
        <>
          <div className="row row-cols-2 row-cols-lg-3 g-3">
            {items.map((news: LightNews) => (
              <div className="col" key={news.id}>
                <Link
                  href={`/${news.url || news.id}`}
                  className="border h-100 bg-white d-block text-decoration-none text-dark p-2"
                >
                  <div className="d-flex justify-content-center mb-2">
                    {news.hinhdaidien ? (
                      <Image
                        src={news.hinhdaidien}
                        alt={news.tieude || "Tin liên quan"}
                        width={300}
                        height={180}
                        className="img-fluid rounded"
                      />
                    ) : (
                      <div className="bg-light rounded w-100" style={{ height: 120 }} />
                    )}
                  </div>
                  <div className="small">
                    <strong className="d-block mb-1">{news.tieude}</strong>
                    {news.noidungtomtat ? (
                      <div
                        className="text-truncate-2 mb-1"
                        dangerouslySetInnerHTML={{ __html: news.noidungtomtat }}
                      />
                    ) : null}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {pageCount > 1 && (
            <nav className="mt-3 d-flex justify-content-center">
              <ul className="pagination mb-0">
                <li className={`page-item ${page <= 1 || loading ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => !loading && setPage(Math.max(1, page - 1))}
                  >
                    PREV
                  </button>
                </li>

                {pages.map((p) => (
                  <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => !loading && setPage(p)}
                      disabled={loading}
                    >
                      {p}
                    </button>
                  </li>
                ))}

                {/* Chỉ hiện dấu …, KHÔNG hiện số trang cuối */}
                {pageCount > visibleCount && (
                  <li className="page-item disabled">
                    <span className="page-link">…</span>
                  </li>
                )}

                <li className={`page-item ${page >= pageCount || loading ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => !loading && setPage(Math.min(pageCount, page + 1))}
                  >
                    NEXT
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
