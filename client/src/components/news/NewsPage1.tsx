/*"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NewsPage({ id }: { id: string }) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/proxyNews?id=${id}&sl=30&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setNews(data?.[0]?.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, page]);

  if (loading) return <div></div>;

  return (
    <section className="py-5">
      <h4 className="fw-bold text-success border-bottom border-3 border-success pb-2 mb-4">
        Tin tức
      </h4>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {news.map((item) => (
          <div className="col" key={item.id}>
            <Link href={`/news/${id}/${item.id}`} className="text-decoration-none text-dark">
              <div className="h-100 shadow-sm border-0">
                {item.hinhdaidien && (
                  <Image
                    src={item.hinhdaidien}
                    width={400}
                    height={250}
                    alt={item.tieude}
                    className="card-img-top object-fit-cover"
                  />
                )}
                <div className="card-body">
            <h6 className="card-title fw-bold">{item.tieude}</h6>
            <p className="card-text">{item.noidungtomtat}</p>
            <span className="text-muted small">{item.ngaydang}</span>
          </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <nav className="my-5">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <button
              className="page-link"
              disabled={page == 1}
              onClick={(e) => {
                e.preventDefault();
                setPage(page - 1);
              }}
            >
              PREV
            </button>
          </li>
          {[1, 2, 3, 4].map((num) => (
            <li className="page-item" key={num}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setPage(num);
                }}
                className="page-link"
              >
                {num}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button className="page-link">
              {page == 1 ? "..." : "Trang hiện tại " + page}
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              NEXT
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
}*/
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface NewsItem {
  id: string;
  ngaydang: string;
  hinhdaidien: string;
  tieude: string;
  url: string;
  noidungtomtat: string;
}

interface NewsPageProps {
  id: string; // Thêm prop id vào đây
}
export default function NewsPage({ id }: NewsPageProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://demodienmay.125.atoz.vn/ww2/module.tintuc.chitiet.lienquan.asp?id=45386&sl=30&pageid=1"
    )
      .then((res) => res.json())
      .then((data) => {
        setNews(data[0].data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Đang tải tin tức...</div>;

  return (
    <section className="container py-4">
      <h6 className="fw-bold text-success border-bottom border-3 border-success">
        TIN TỨC
      </h6>
      <div className="d-flex flex-wrap gap-3">
        {news.map((item) => (
          <div key={item.id} className="card" style={{ width: "100%", maxWidth: "600px", minHeight: "200px" }}>
            <div className="d-flex align-items-start p-2">
              {item.hinhdaidien ? (
                <Image
                  src={item.hinhdaidien}
                  alt={item.tieude}
                  width={200}
                  height={200}
                  className="rounded object-fit-cover me-3"
                />
              ) : (
                <div style={{ width: 200, height:200, background: "#eee" }} className="me-3" />
              )}
              <div className="flex-grow-1">
                <a
                  href={item.url}
                  className="text-primary fw-bold text-decoration-none mb-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.tieude}
                </a>
                <div className="text-secondary mb-2" style={{ fontSize: 14 }}>
                  {item.noidungtomtat}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  {item.ngaydang}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}