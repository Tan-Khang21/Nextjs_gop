"use client";

import React, { useEffect } from "react";
// import RelatedproductRelatedduct from "../products/RelatedProduct";
import SpinAnimation from "../items/SpinAnimation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getNewsDetail } from "@/redux/api/reduxContentApi";
import { useParams } from "next/navigation";
import RelatedNews from "./NewsRelated";

export default function NewsDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const id = params.slug3;
  useEffect(() => {
    const getNews = async () => {
      await dispatch(getNewsDetail({ id: id as string }));
    };
    getNews();
  }, [dispatch, id]);

  const { newsDetail } = useSelector((state: RootState) => state.contents);
  return (
    <div>
      {newsDetail ? (
        <div className="p-2 mt-2 min-vh-100">
          {newsDetail.map((news, idx) => (
            <div key={idx}>
              <div>
                <h1>{news.tieude}</h1>
                <p>Ngày đăng: {news.ngaydang}</p>
                <p>Lượt xem:{news.luotxem}</p>
              </div>
              {/* News Info */}
              <div className="row">
                {/* Left : Image + Gallery */}
                <div className="col-lg-7 mb-4 w-100">
                  <div className="p-3 border w-100">
                    <div className="mb-3 w-100 d-flex justify-content-center">
                      <Image
                        src={`${news.hinhdaidien}`}
                        alt={news.tieude}
                        title={news.tieude}
                        width={440}
                        height={300}
                        className="w-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* Right : News Details */}
              </div>
              {/* News Description */}
              <h5 className="border-bottom border-2 border-success fw-semibold text-success">
                TIN CHI TIẾT
              </h5>
              <div className="bg-white p-3 border position-relative">
                <div>
                  <div
                    
                    className="productDescription"
                    dangerouslySetInnerHTML={{
                      __html: news.noidungchitiet,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <RelatedNews id={id as string} />
        </div>
      ) : (
        <SpinAnimation />
      )}
    </div>
  );
}
