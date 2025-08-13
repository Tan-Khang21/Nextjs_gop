"use client";
import {
  fetchVietNameAddress,
  VietNameAddressInterface,
} from "@/api/contentApi";
import { oderFunction } from "@/redux/api/reduxContentApi";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpinAnimation from "../items/SpinAnimation";
interface OrderForm {
  tel: string | undefined;
  pay_method: string;
  note: string;
  quantity: number;
  customer_name: string | undefined;
  address: string | false | undefined;
}
export default function Order({
  product_id,
  product_price,
}: {
  product_id: string;
  product_price: number;
  product_name: string;
}) {
  const { users } = useSelector((state: RootState) => state.auths);
  const [defaultAddress, setDefaultAddress] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [address, setAddress] = useState<VietNameAddressInterface[] | null>([]);
  const router = useRouter();

  useEffect(() => {
    if (!users?.email) {
      router.push("/login");
    }
  }, [users, router]);

  //state xác định select sẽ hiện
  const [provinceName, setProvinceName] = useState<string>();
  const [districtsName, setDistrictsName] = useState<string>();
  const [wardName, setWardName] = useState<string>();
  const [oderData, setOderData] = useState<OrderForm>({
    tel: "",
    note: "",
    address: "",
    customer_name: "",
    pay_method: "",
    quantity: 1,
  });

  const { loading } = useSelector((state: RootState) => state.contents);

  const dispatch = useDispatch<AppDispatch>();
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      oderFunction({
        product_price,
        items: [
          {
            idpart: Number(product_id),
            quantity: Number(oderData.quantity),
            price: product_price,
          },
        ],
        customer_name: defaultAddress ? users?.name : oderData.customer_name,
        tel: defaultAddress ? users?.phone : oderData.tel,
        email: users?.email as string,
        address: defaultAddress
          ? users?.address
          : `${oderData.address} - ${wardName} - ${districtsName} - ${provinceName}`,
        //đừng xóa dấu cách nào ở đây hết nếu không sẽ lỗi :)))
        note: oderData.note,
        total_price: oderData.quantity * product_price,
        pay_method: oderData.pay_method,
      })
    );
    if (oderData.pay_method==="banking"&&oderFunction.fulfilled.match(result)) {
      const payload = result.payload.link;
      const IDBG = result.payload.order_id;
      router.push(
        `/checkout?qr=${payload.qrCode}&orderCode=${payload.orderCode}&paymentLinkId=${payload.paymentLinkId}&amount=${payload.amount}&order_id=${IDBG}`
      );
    }
  };

  useEffect(() => {
    const fetchDataAddress = async () => {
      try {
        const res = await fetchVietNameAddress();
        setAddress(res);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error);
        }
        return null;
      }
    };
    fetchDataAddress();
  }, []);

  const handleOnchange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setOderData({ ...oderData, [e.target.name]: e.target.value });
  };
  const formList = [
    { label: "Họ và tên người nhận hàng", type: "text", name: "customer_name" },
    {
      label: "Số điện thoại liên hệ",
      type: "tel",
      name: "tel",
    },
    { label: "Số lượng đơn đặt", type: "number", name: "quantity" },
    { label: "Ghi chú đơn hàng", type: "text", name: "note" },
  ];

  if (loading) {
    return <SpinAnimation />;
  }
  return (
    <div
      className="modal fade"
      id="myModal"
      tabIndex={-1}
      aria-hidden="true"
      ref={modalRef}
    >
      <form className="modal-dialog modal-dialog-centered">
        <div className="shadow modal-content">
          <div className="text-white modal-header bg-primary">
            <h5 className="modal-title fw-bold">THÔNG TIN ĐẶT HÀNG</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          {/* Nội dung biểu mẫu */}
          <div className="px-4 py-3 modal-body">
            <div className="mb-3">
              {defaultAddress ? (
                <>
                  {/* lấy thông tin mặc định */}
                  <label htmlFor="" className="form-label fw-semibold">
                    Lấy thông tin mặc định của bạn
                  </label>
                  <input
                    type="checkbox"
                    className="ms-1"
                    checked={defaultAddress}
                    onChange={() => setDefaultAddress(!defaultAddress)}
                    required
                  />
                  {/* pttt */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Phương thức thanh toán
                    </label>
                    <select
                      name="pay_method"
                      onChange={handleOnchange}
                      className="form-select"
                    >
                      <option value="cod">Thanh toán khi nhận hàng</option>
                      <option value="banking">Chuyển khoản ngân hàng</option>
                    </select>
                  </div>
                  {/* quantity */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Số lượng</label>
                    <input
                      onChange={handleOnchange}
                      type="text"
                      name="quantity"
                      placeholder="Số lượng đơn hàng"
                      className="border form-control"
                    />
                  </div>
                  {/* note */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Ghi chú</label>
                    <input
                      onChange={handleOnchange}
                      type="text"
                      name="note"
                      placeholder="Ghi chú đơn hàng"
                      className="border form-control"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* thông tin nhận hàng */}
                  {formList.map((item, idx) => (
                    <div className="mb-3" key={idx}>
                      <label className="form-label fw-semibold">
                        {item.label}
                      </label>
                      <input
                        onChange={handleOnchange}
                        type={item.type}
                        name={item.name}
                        placeholder={item.label}
                        className="border form-control"
                        ref={inputRef}
                      />
                    </div>
                  ))}
                  {/* phương thức thanh toán */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Phương thức thanh toán
                    </label>
                    <select
                      name="pay_method"
                      onChange={handleOnchange}
                      className="form-select"
                    >
                      <option value="cod">Thanh toán khi nhận hàng</option>
                      <option value="banking">Chuyển khoản ngân hàng</option>
                    </select>
                  </div>
                  {/* địa chỉ */}
                  <label htmlFor="" className="form-label fw-semibold">
                    Địa chỉ giao hàng
                  </label>{" "}
                  <select
                    name=""
                    className="mb-3 form-select"
                    id=""
                    onChange={(e) => setProvinceName(e.target.value)}
                  >
                    {address?.map((add) => (
                      <option key={add.code} value={add.name}>
                        {add.name}
                      </option>
                    ))}{" "}
                  </select>
                  {provinceName && (
                    <select
                      className="mb-3 form-select"
                      onChange={(e) => setDistrictsName(e.target.value)}
                    >
                      {address
                        ?.find((pr) => pr.name === provinceName)
                        ?.districts.map((distr) => (
                          <option value={distr.name} key={distr.code}>
                            {distr.name}
                          </option>
                        ))}
                    </select>
                  )}
                  {districtsName && (
                    <select
                      className="mb-3 form-select"
                      onChange={(e) => setWardName(e.target.value)}
                    >
                      {address?.map((pr) =>
                        pr?.districts
                          .find((disr) => disr.name === districtsName)
                          ?.wards.map((w) => (
                            <option value={w.name} key={w.code}>
                              {w.name}
                            </option>
                          ))
                      )}
                    </select>
                  )}
                  {districtsName && (
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Địa chỉ cụ thể
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        onChange={handleOnchange}
                      />
                    </div>
                  )}
                  <label htmlFor="" className="form-label fw-semibold">
                    Lấy thông tin mặc định của bạn
                  </label>
                  <input
                    type="checkbox"
                    className="ms-1"
                    checked={defaultAddress}
                    onChange={() => setDefaultAddress(!defaultAddress)}
                    required
                  />
                </>
              )}
            </div>

            <p className="text-warning">
              *Lưu ý số điện thoại, tên và địa chỉ sẽ được lấy mặc định của bạn
              nếu bạn không nhập dữ liệu,nếu đặt hàng giúp người khác vui lòng
              điền đầy đủ để thành nhầm lẫn
            </p>
          </div>

          {/* Nút xác nhận */}
          <div className="modal-footer">
            <button
              onClick={handleOrder}
              type="button"
              data-bs-dismiss="modal"
              className="btn btn-success w-100 fw-bold"
            >
              XÁC NHẬN ĐẶT HÀNG
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
