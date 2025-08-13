import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

export default function Error() {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1>404-ERROR</h1>
        <p className="fw-semibold">
          Trang này không tồn tại hoặc bị lỗi, xin lỗi vĩ bất tiện này
        </p>
        <Link href={"/"} className="">
          Trở lại trang chủ
          <FontAwesomeIcon icon={faHouse} className="ms-1" />
        </Link>
      </div>
    </div>
  );
}
