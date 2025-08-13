"use client";

import { RootState } from "@/redux/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Profile() {
  const { users } = useSelector((state: RootState) => state.auths);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="rounded shadow card">
            <div className="gap-4 card-body d-flex flex-column flex-md-row align-items-center">
              {/* Avatar */}
              <div className="text-center">
                <Image
                  src={
                    users?.avt ??
                    "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt="Avatar"
                  width={120}
                  height={120}
                  className="rounded-circle"
                />
              </div>

              {/* Thông tin khách hàng */}
              <div className="w-100">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Tên khách hàng:</strong> {users?.name || "Chưa có"}
                  </li>
                  <li className="list-group-item">
                    <strong>Email:</strong> {users?.email || "Chưa có"}
                  </li>
                  <li className="list-group-item">
                    <strong>Địa chỉ</strong> {users?.address || "Chưa có"}
                  </li>
                  <li className="list-group-item">
                    <strong>Mã khách hàng:</strong>{" "}
                    {users?.userCode || "Chưa có"}
                  </li>
                  <li className="list-group-item">
                    <strong>Giới tính:</strong> {users?.gender || "Chưa có"}
                  </li>
                  <li className="list-group-item">
                    <strong>SĐT:</strong> {users?.phone || "Chưa có"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
