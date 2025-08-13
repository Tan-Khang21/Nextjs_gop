"use client";
import { getCart } from "@/redux/api/reduxContentApi";
import { AppDispatch, RootState } from "@/redux/store";
import { formatGia } from "@/redux/utils";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpinAnimation from "../items/SpinAnimation";
import Image from "next/image";
import Order from "./Order";
import { removeCartApi, updateCartQuantity } from "@/api/contentApi";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { cart } = useSelector((state: RootState) => state.contents);
  const { users } = useSelector((state: RootState) => state.auths);
  const [quantities, setQuantities] = useState<{
    [product_id: string]: number;
  }>({});
  const [updateResult, setUpdateResult] = useState("");
  const email = users?.email;

  useEffect(() => {
    if (email) {
      dispatch(getCart({ email }));
    }
  }, [dispatch, email]);

  if (!cart) return <SpinAnimation />;

  const handleUpdateQuantity = async (product_id: string) => {
    const quantity = quantities[product_id];
    if (!quantity || quantity <= 0) return;

    const result = await updateCartQuantity({
      email: email as string,
      product_id,
      quantity,
    });
    setUpdateResult(result);
  };
  const handleRemoveCart = async (product_id: string) => {
    const result = await removeCartApi({
      email: email as string,
      product_id: product_id.trimEnd(),
    });
    setUpdateResult(result);
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center fw-bold text-uppercase">
        🛒 Giỏ hàng của bạn
      </h3>

      {cart.data.length > 0 ? (
        <div className="row g-4">
          {cart.data.map((item) => (
            <div className="col-md-6 col-lg-4" key={item.product_id}>
              <div className="border shadow-sm card h-100 rounded-4">
                <Image
                  src={item.img.trimEnd()}
                  alt="product img"
                  width={500}
                  height={300}
                  className="card-img-top object-fit-cover rounded-top-4"
                  style={{ maxBlockSize: 220, inlineSize: "100%" }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate fw-semibold">
                    🛍 {item.product_name || "Không rõ"}
                  </h5>

                  <p className="mb-1">
                    <strong>Giá:</strong>{" "}
                    <span className="text-danger">{formatGia(item.price)}</span>
                  </p>

                  <p className="mb-1">
                    <strong>Số lượng:</strong>
                    <input
                      type="number"
                      min={1}
                      className="mt-1 form-control"
                      placeholder={`${item.quantity}`}
                      value={quantities[item.product_id] ?? ""}
                      onChange={(e) =>
                        setQuantities({
                          ...quantities,
                          [item.product_id]: Number(e.target.value),
                        })
                      }
                    />
                  </p>

                  <p className="mb-2 text-muted">
                    <strong>Mã SP:</strong> #{item.product_id.trimEnd()}
                  </p>

                  {/* Order form */}
                  <Order
                    product_name={item.product_name}
                    product_price={Number(item.price)}
                    product_id={item.product_id.trimEnd()}
                  />

                  {/* Action buttons */}
                  <div className="gap-2 pt-2 mt-auto d-flex justify-content-between">
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#myModal"
                      className="btn btn-success btn-sm flex-fill"
                    >
                      MUA
                    </button>
                    <button
                      className="btn btn-warning btn-sm flex-fill"
                      onClick={() => handleUpdateQuantity(item.product_id)}
                    >
                      CẬP NHẬT
                    </button>
                    <button
                      className="btn btn-danger btn-sm flex-fill"
                      onClick={() => handleRemoveCart(item.product_id)}
                    >
                      XÓA
                    </button>
                  </div>

                  {updateResult && (
                    <p className="mt-2 text-center text-success small">
                      {updateResult}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center alert alert-secondary" role="alert">
          Giỏ hàng của bạn đang trống 😢
        </div>
      )}
    </div>
  );
}
