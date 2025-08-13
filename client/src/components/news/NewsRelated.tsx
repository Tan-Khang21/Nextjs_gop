import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

export default function RelatedNews({ id }: { id: string }) {
  const { newsRelated } = useSelector((state: RootState) => state.contents);
  return (
    <div>
      <div>
        {newsRelated ? (
          <section className="py-4">
            <h6 className="fw-bold text-success border-bottom border-3 border-success">
              {newsRelated.tieude?.toString().toLocaleUpperCase()}
            </h6>

            {/* Hiển thị danh sách tin tức*/}

            <div className="">
              <div className="row row-cols-2 row-cols-lg-3 g-2">
                {newsRelated.data?.map((news) => (
                  <div className="col" key={news.id}>
                    <Link
                      href={`/tintuc/${id}/${news.id}`}
                      className="border h-100 bg-white d-block text-decoration-none text-dark p-2 zoom-hover"
                    >
                      {/* Hình ảnh */}
                      <div className="d-flex justify-content-center mb-2">
                        {news.hinhdaidien && (
                          <Image
                            src={`${news.hinhdaidien}`}
                            alt={news.tieude}
                            width={200}
                            height={200}
                            className="img-fluid"
                          />
                        )}
                      </div>

                      {/* Thông tin */}
                      <div>
                        <strong>{news.tieude}</strong>
                        <div
                          className="text-truncate"
                          dangerouslySetInnerHTML={{ __html: news.tomtat }}
                        />
                        <p>{news.ngaydang}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
