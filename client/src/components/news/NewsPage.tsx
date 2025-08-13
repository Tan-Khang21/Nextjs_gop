"use client";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpinAnimation from "../items/SpinAnimation";
import { getNews } from "@/redux/api/reduxContentApi";

export default function NewsPage({ id }: { id: string }) {
  const { news, loading } = useSelector((state: RootState) => state.contents);
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    const fetchNews = async () => {
      await dispatch(getNews({ id: id, sl: 30, page: page }));
    };
    fetchNews();
  }, [dispatch, id, page]);
  if (loading == true) {
    return <SpinAnimation />;
  }
  console.log("Full news from Redux:", news)
  console.log("News[id]:", news[id]) 
  /*return news[id] ? (
    <section className="py-5">
      <h4 className="fw-bold text-success border-bottom border-3 border-success pb-2 mb-4">
        Tin tức
      </h4>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {Object.entries(news).map(([key, value]) => {
  console.log(`News ID: ${key}`, value);
  return null;
})}
      {news[id]?.map((blog) => {
  console.log("Blog data:", blog.data); // ✅ đúng chỗ

  // Tránh lỗi nếu blog.data không phải mảng
  const dataList = Array.isArray(blog.data) ? blog.data : [];

  return dataList.map((item) => (
    <div className="col" key={item.id}>
      <Link href={`/${blog.module.toLocaleLowerCase()}/${id}/${item.id}`} className="text-decoration-none text-dark">
        <div className="h-100 shadow-sm border-0">
          {item.hinhdaidien && (
            <Image
              src={item.hinhdaidien}
              width={400}
              height={250}
              alt={item.tieude}
              style={{ blockSize: "200px" }}
              className="card-img-top object-fit-cover"
            />
          )}
          <div className="card-body">
            <h6 className="card-title fw-bold">{item.tieude}</h6>
          </div>
        </div>
      </Link>
    </div>
  ));
})}

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
          <li className="page-item">
            <button
              onClick={(e) => {
                e.preventDefault();
                setPage(1);
              }}
              className="page-link"
            >
              1
            </button>
          </li>
          <li className="page-item">
            <button
              onClick={(e) => {
                e.preventDefault();
                setPage(2);
              }}
              className="page-link"
            >
              2
            </button>
          </li>
          <li className="page-item">
            <button
              onClick={(e) => {
                e.preventDefault();
                setPage(3);
              }}
              className="page-link"
            >
              3
            </button>
          </li>
          <li className="page-item">
            <button
              onClick={(e) => {
                e.preventDefault();
                setPage(4);
              }}
              className="page-link"
            >
              4
            </button>
          </li>
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
  ) : null;
}*/

return (
  <>
    <section className="py-5">
      <h4 className="fw-bold text-success border-bottom border-3 border-success pb-2 mb-4">
        Tin tức
      </h4>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {(news[id]?.[0]?.data || []).map((item) => (
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
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
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
  </>
);}

