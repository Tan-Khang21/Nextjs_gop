"use client";

import { getWishList } from "@/redux/api/reduxContentApi";
import { AppDispatch, RootState } from "@/redux/store";
import { formatGia, toSlug } from "@/redux/utils";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

export default function WishList() {
  const dispatch = useDispatch<AppDispatch>();
  const { wishlist } = useSelector((state: RootState) => state.contents);
  useEffect(() => {
    dispatch(getWishList());
  }, [dispatch]);
  const removeWishlist = (id: string) => {
    const savedWishlist: {
      ProductID: string;
      Image: string;
      Price: number;
      Title: string;
    }[] = JSON.parse(sessionStorage.getItem("wishlist") || "[]");
    const found = savedWishlist.filter((f) => f.ProductID !== id);
    sessionStorage.setItem("wishlist", JSON.stringify(found));
  };
  return (
    <div className="container my-4">
      <h4 className="mb-3">Danh sách yêu thích</h4>
      <div className="table-responsive">
        <table className="table text-center align-middle table-bordered">
          <thead className="table-light">
            <tr>
              <th>Tên</th>
              <th>Ảnh</th>
              <th>Giá</th>
              <th>Mã sản phẩm</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {wishlist?.map((item) => (
              <tr key={item.ProductID}>
                <td
                  className="text-truncate"
                  style={{ maxInlineSize: "200px" }}
                >
                  {item.Title || "Không rõ"}
                </td>
                <td>
                  <Image
                    src={item.Image}
                    alt={item.Title}
                    width={100}
                    height={100}
                    className="w-auto h-100"
                  />
                </td>
                <td>{formatGia(item.Price)}</td>
                <td>#{item.ProductID}</td>
                <td className="gap-2 d-flex align-items-center justify-content-center">
                  <Link
                    href={`/sanpham/${toSlug(item.Title)}/${item.ProductID}`}
                    className="btn btn-outline-success btn-sm"
                  >
                    MUA
                  </Link>
                  <button
                    onClick={() => removeWishlist(item.ProductID)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    XÓA
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
