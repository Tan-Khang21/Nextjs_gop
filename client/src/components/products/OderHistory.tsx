"use client";
import { getOder } from "@/redux/api/reduxContentApi";
import { AppDispatch, RootState } from "@/redux/store";
import { formatGia, toSlug } from "@/redux/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpinAnimation from "../items/SpinAnimation";
import { removeOrder } from "@/api/contentApi";

export default function OderHistory() {
  const dispatch = useDispatch<AppDispatch>();

  const { orderapi } = useSelector((state: RootState) => state.contents);
  const { users } = useSelector((state: RootState) => state.auths);

  useEffect(() => {
    if (users?.email) {
      dispatch(getOder({ email: users.email }));
    }
  }, [dispatch, users]);

  if (!orderapi) {
    return <SpinAnimation />;
  }

  // hủy đơn hàng
  const handleCancel = async (order_id: string) => {
    await removeOrder(users?.email as string, order_id as string);
  };
  return (
    <div className="container py-5">
      <h3 className="mb-4 text-center fw-bold text-uppercase">
        Lịch sử đơn hàng
      </h3>
      {orderapi?.length === 0 ? (
        <div className="text-center alert alert-secondary" role="alert">
          Bạn chưa đặt đơn hàng nào cả 😢
        </div>
      ) : (
        <div className="gap-1 row g-4">
          {orderapi.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white border rounded shadow-sm col-lg-5 col-12"
            >
              {/* Thông tin đơn hàng */}
              <div className="pb-2 mb-3 border-bottom">
                <h5 className="mb-2 fw-bold">Thông tin đơn hàng</h5>
                <p className="mb-1">
                  <strong>Mã đơn hàng:</strong> #{order.id}
                </p>
                <p className="mb-1">
                  <strong>Người đặt:</strong> {order.customer_name}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {order.email}
                </p>
                <p className="mb-1">
                  <strong>Số điện thoại:</strong> {order.tel}
                </p>
                <p className="mb-1">
                  <strong>Trạng thái:</strong>{" "}
                  <span
                    className={`badge ${
                      order.status === "0"
                        ? "bg-warning text-dark"
                        : order.status === "1"
                        ? "bg-info"
                        : "bg-success"
                    }`}
                  >
                    {order.status === "0"
                      ? "Thanh toán khi nhận hàng"
                      : order.status === "1"
                      ? "Đã thanh toán"
                      : "Đã nhận hàng"}
                  </span>
                </p>
                <p className="mb-1">
                  <strong>Ghi chú:</strong> {order.note ?? "Không có"}
                </p>
                <p className="mb-1">
                  <strong>Tổng giá trị:</strong> {formatGia(order.total_price)}
                </p>
                <p className="mb-1">
                  <strong>Ngày đặt:</strong> {order.date}
                </p>
                <div className="gap-2 d-flex">
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="btn btn-danger"
                  >
                    Hủy đơn hàng
                  </button>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="">
                <h6 className="mb-3 fw-bold">Sản phẩm trong đơn:</h6>
                <div className="row g-3">
                  {order.items.map((item) => (
                    <Link
                      href={`/sanpham/${toSlug(item.name)}/${item.id}`}
                      key={item.id}
                      className="col-12 d-flex align-items-start text-decorat"
                    >
                      <Image
                        src={`https://choixanh.com.vn${item.image}`}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="border rounded me-3"
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <p
                          className="mb-1 text-truncate"
                          style={{ maxInlineSize: "150px" }}
                        >
                          {item.name}
                        </p>
                        <p className="mb-1">Số lượng: {item.quantity}</p>
                        <p className="mb-1">Giá: {formatGia(item.price)}</p>
                        <p className="mb-0">Mã SP:#{item.id}</p>
                      </div>
                    </Link>
                  ))}
                </div>{" "}
              </div>
              {/* Hành động */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
