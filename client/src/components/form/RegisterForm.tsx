"use client";

import { FormDataRegister } from "@/api/authApi";
import { register } from "@/redux/api/reduxAuthApi";
import { AppDispatch, RootState } from "@/redux/store";
import {
  faEnvelope,
  faHome,
  faLock,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RegisterForm() {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  //Thông báo sau khi đăng ký
  const { registerResponse, loading } = useSelector((state: RootState) => state.auths);
  //form đăng ký
  const [data, setData] = useState<FormDataRegister>({
    name: "",
    username: "",
    password: "",
    email: "",
    tel: "",
  });

  //onchange form đăng ký
  const handleOnchange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //xử lý đăng ký
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreeToTerms) {
      return;
    }
    
    const result = await dispatch(
      register({
        email: data.email,
        name: data.name,
        username: data.username,
        password: data.password,
        tel: data.tel,
      })
    );
    
    // Reset form và redirect nếu đăng ký thành công
    if (register.fulfilled.match(result) && result.payload.success) {
      setData({
        name: "",
        username: "",
        password: "",
        email: "",
        tel: "",
      });
      setAgreeToTerms(false);
      
      // Redirect đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center">
      <div className="p-5 bg-white rounded shadow w-75">
        <h3 className="mb-4 text-center">Đăng ký tài khoản</h3>
        {registerResponse && (
          <div
            className={`alert text-center ${
              registerResponse.success == false
                ? "alert-danger"
                : "alert-success"
            }`}
          >
            {registerResponse.message}
            {registerResponse.success && (
              <div className="mt-2 small">
                <i className="fas fa-spinner fa-spin me-2"></i>
                Đang chuyển đến trang đăng nhập...
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="gap-3 d-flex flex-column">
          {/* Họ và tên */}
          <div className="input-group">
            <span className="bg-white input-group-text">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleOnchange}
              placeholder="Họ và tên"
              className="form-control"
              required
            />
          </div>

          {/* Username */}
          <div className="input-group">
            <span className="bg-white input-group-text">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              type="text"
              name="username"
              value={data.username}
              onChange={handleOnchange}
              placeholder="Tên đăng nhập"
              className="form-control"
              required
              minLength={3}
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <span className="bg-white input-group-text">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleOnchange}
              placeholder="Email"
              className="form-control"
              required
            />
          </div>
          {/* Số điện thoại */}
          <div className="input-group">
            <span className="bg-white input-group-text">
              <FontAwesomeIcon icon={faPhone} />
            </span>
            <input
              type="tel"
              name="tel"
              value={data.tel}
              onChange={handleOnchange}
              placeholder="Số điện thoại"
              className="form-control"
              required
            />
          </div>
          {/* Mật khẩu */}
          <div className="input-group">
            <span className="bg-white input-group-text">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleOnchange}
              placeholder="Mật khẩu"
              className="form-control"
              required
              minLength={6}
            />
          </div>

          {/* Đồng ý điều khoản */}
          <div className="gap-2 form-check d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input"
              id="terms"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms(!agreeToTerms)}
              required
            />
            <label className="form-check-label" htmlFor="terms">
              Tôi đồng ý với{" "}
              <a href="#" className="text-primary text-decoration-underline">
                điều khoản sử dụng
              </a>
            </label>
          </div>

          {/* Nút đăng ký */}
          <div className="text-center">
            <button
              type="submit"
              className="px-5 btn btn-success rounded-pill fw-semibold"
              disabled={!agreeToTerms || loading}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </div>
        </form>

        <div className="gap-2 my-4 d-flex justify-content-center align-items-center">
          <Link href={"/"} className="btn">
            <FontAwesomeIcon icon={faHome} className="mx-2" />
            Home
          </Link>
          <Link href={"/login"} className="btn">
            <FontAwesomeIcon icon={faUser} className="mx-2" />
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
