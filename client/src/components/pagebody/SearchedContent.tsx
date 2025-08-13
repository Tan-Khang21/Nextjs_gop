"use client";

import { useEffect } from "react";
import Link from "next/link";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SpinAnimation from "../items/SpinAnimation";
import { formatGia } from "@/redux/utils";
import { searchContentByKeyword } from "@/redux/api/reduxContentApi";
import { useSearchParams } from "next/navigation";
export default function SearchedContent() {
  // Fetch sản phẩm
  const searchParams = useSearchParams();
  const searchKeyWord = searchParams.get("keyword");
  const { loading, searchedContent } = useSelector(
    (state: RootState) => state.contents
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(
          searchContentByKeyword({ key: searchKeyWord as string })
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [searchKeyWord, dispatch]);

  if (loading == true) {
    return <SpinAnimation />;
  }
  return (
    <div>
      {searchedContent && searchedContent.length != 0 ? (
        <section className="py-4">
          <h6 className="fw-bold text-success border-bottom border-3 border-success">
            TÌM KIẾM
          </h6>
          {/* Hiển thị danh sách sản phẩm */}
          <div className="d-block">
            <div className="row row-cols-2 row-cols-lg-3 g-2">
              {searchedContent.map((content) => (
                <div className="col" key={content.id}>
                  <Link
                    href={`/${content.kieuhienthi}/${content.idparent}/${content.id}`}
                    className="border h-100 bg-white d-block text-decoration-none text-dark p-2 zoom-hover"
                  >
                    {/* Khuyến mãi */}

                    <div className="mb-2">
                      <span className="p-1 text-bg-danger rounded">
                        {content.giakhuyenmai}%
                      </span>
                    </div>
                    {/* Hình ảnh */}
                    <div className="d-flex justify-content-center mb-2">
                      {content.hinhdaidien && (
                        <Image
                          src={`${content.hinhdaidien}`}
                          alt={content.tieude}
                          width={200}
                          height={200}
                          className="img-fluid"
                        />
                      )}
                    </div>

                    {/* Thông tin */}
                    <div>
                      <p className="text-truncate">{content.tieude}</p>
                      <p className="text-danger">
                        &#8363; {formatGia(content.gia)}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
          <p className="text-center fs-2">Không tìm thấy nội dung nào</p>
        </div>
      )}
    </div>
  );
}
