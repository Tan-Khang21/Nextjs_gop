"use client";
import { cancelCheckout } from "@/api/contentApi";
import { checkPaymentApi } from "@/redux/api/reduxContentApi";
import { AppDispatch, RootState } from "@/redux/store";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessModal from "./ModalAlert";

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const qrCode = searchParams.get("qr");
  const [cancel, setCancel] = useState("");
  const amount = searchParams.get("amount");
  const orderCode = searchParams.get("orderCode");
  const paymentLinkId = searchParams.get("paymentLinkId");
  const order_id = searchParams.get("order_id");
  const { paymentResult } = useSelector((state: RootState) => state.contents);
  const { users } = useSelector((state: RootState) => state.auths);
  const [alert, setAlert] = useState(false);
  useEffect(() => {
    const fetchResultPayment = async () => {
      await dispatch(
        checkPaymentApi({ paymentLinkId: paymentLinkId as string })
      );
    };
    const interval = setInterval(() => {
      fetchResultPayment();
    }, 2000);

    return () => clearInterval(interval);
  }, [paymentLinkId, dispatch, paymentResult]);

  useEffect(() => {
    if (
      paymentResult === "CANCELLED" ||
      paymentResult === "FAILED" ||
      cancel === "CANCELLED"
    ) {
      cancelCheckout({
        email: users?.email as string,
        orderCode: orderCode as string,
        order_id: order_id as string,
      });
      window.location.href = "/";
    }
    if (paymentResult === "PAID") {
      setAlert(true);
    }
  }, [paymentResult, cancel, orderCode, order_id, users]);

  const handleCancel = async () => {
    const act = await cancelCheckout({
      orderCode: orderCode as string,
      email: users?.email as string,
      order_id: order_id as string,
    });
    setCancel(act);
  };
  const handleModalClose = () => {
    setAlert(false);
    window.location.href = "/";
  };
  return (
    <>
      <SuccessModal open={alert} onClose={handleModalClose} />
      <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div
          className="p-4 shadow-lg card w-100"
          style={{ maxInlineSize: 700 }}
        >
          <h2 className="mb-4 text-center text-primary fw-bold">
            Thanh Toán Đơn Hàng
          </h2>
          <div className="mb-3 row">
            {/* Thông tin đơn hàng */}
            <div className="mb-3 col-md-6">
              <div className="p-3 bg-white border rounded">
                <p className="mb-2">
                  <strong>Mã đơn hàng:</strong> <br />
                  <span className="text-danger fs-5">#{orderCode}</span>
                </p>
                <p>
                  <strong>Tổng tiền:</strong> <br />
                  <span className="text-success fs-5">
                    {Number(amount).toLocaleString()} VND
                  </span>
                </p>
                <p className="text-muted small">
                  Vui lòng quét mã QR bên phải bằng app ngân hàng hoặc cổng
                  thanh toán để hoàn tất giao dịch.
                </p>
                <button className="btn btn-danger" onClick={handleCancel}>
                  Hủy thanh toán
                </button>
              </div>
            </div>

            {/* Mã QR */}
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              {qrCode ? (
                <QRCodeSVG value={qrCode} size={220} />
              ) : (
                <p className="text-danger">Không tìm thấy mã QR.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
