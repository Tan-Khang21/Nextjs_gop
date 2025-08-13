"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faLock,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { login } from "@/redux/api/reduxAuthApi";

interface FormDataLogin {
  email: string;
  password: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState<FormDataLogin>({
    email: "",
    password: "",
  });
  const { resultCode, loginMessage, loading } = useSelector((state: RootState) => state.auths);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        login({ email: formData.email, password: formData.password })
      );
      if (login.fulfilled.match(result) && result.payload.resultCode === 1) {
        // Đăng nhập thành công - reset form và redirect đến trang chủ
        setFormData({ email: "", password: "" });
        console.log("Đăng nhập thành công:", result.payload);
        
        // Redirect đến trang chủ sau 1.5 giây
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      console.log("Lỗi đăng nhập:", error);
    }
  };
  return (
    <section className="py-5 d-flex align-items-center justify-content-center min-vh-100">
      {/* Form Đăng nhập */}
      <div className="p-5 border shadow">
        <form
          onSubmit={handleSignIn}
          className="gap-3 rounded d-flex flex-column p-md-5 "
        >
          <h2 className="text-center text-primary fw-bold">Đăng nhập</h2>
          <div className="py-2">
            {resultCode != null ? (
              <div
                className={`alert ${
                  resultCode == 1
                    ? "text-success alert-success"
                    : "text-danger alert-danger"
                } text-center`}
              >
                {loginMessage || (resultCode == 1
                  ? "Đăng nhập thành công!"
                  : "Đăng nhập thất bại!")}
                {resultCode == 1 && (
                  <div className="mt-2 small">
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Đang chuyển đến trang chủ...
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faUser} className="me-1" />
              Email or number
            </label>
            <input
              type="text"
              name="email"
              required
              value={formData.email}
              onChange={handleOnchange}
              className="text-center form-control form-control-lg rounded-pill"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} className="me-1" />
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleOnchange}
              className="text-center form-control form-control-lg rounded-pill"
            />
          </div>
          <div className="text-center">
            <button 
              type="submit" 
              className="btn btn-primary rounded-pill"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>
        </form>
        {/* Đăng nhập MXH + Link */}
        <div className="d-flex flex-column">
          <h5 className="text-center fw-semibold text-secondary">
            Đăng nhập với mạng xã hội
          </h5>
          <div className="gap-2 d-flex flex-column g-2">
            <div className="d-block">
              <div className="d-flex align-items-center justify-content-center">
                <button className="gap-2 btn btn-danger rounded-pill d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={faGoogle} />
                  Google
                </button>
              </div>
            </div>
            <h5 className="mt-3 text-center fw-semibold text-secondary">
              Chưa có tài khoản?
            </h5>
            <div className="gap-3 d-flex justify-content-center">
              <Link href="/register" className="btn btn-success rounded-pill">
                <FontAwesomeIcon icon={faUserPlus} /> Đăng ký
              </Link>
              <Link href="/" className="btn btn-dark rounded-pill">
                <FontAwesomeIcon icon={faHouse} /> Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



/*"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faLock,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { checkAuth, login } from "@/redux/api/reduxAuthApi";

interface FormDataLogin {
  email: string;
  password: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState<FormDataLogin>({
    email: "",
    password: "",
  });
  const { resultCode } = useSelector((state: RootState) => state.auths);
  const dispatch = useDispatch<AppDispatch>();

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        login({ email: formData.email, password: formData.password })
      );
      if (login.fulfilled.match(result)) {
        dispatch(checkAuth());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="py-5 d-flex align-items-center justify-content-center min-vh-100">
      {/* Form Đăng nhập }
      <div className="p-5 border shadow">
        <form
          onSubmit={handleSignIn}
          className="gap-3 rounded d-flex flex-column p-md-5 "
        >
          <h2 className="text-center text-primary fw-bold">Đăng nhập</h2>
          <div className="py-2">
            {resultCode != null ? (
              <p
                className={`alert ${
                  resultCode == 1
                    ? "text-success alert-success"
                    : "text-danger alert-danger"
                } text-center`}
              >
                {resultCode == 1
                  ? "Đăng nhập thành công!"
                  : "Đăng nhập thất bại!"}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faUser} className="me-1" />
              Email or number
            </label>
            <input
              type="text"
              name="email"
              required
              value={formData.email}
              onChange={handleOnchange}
              className="text-center form-control form-control-lg rounded-pill"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} className="me-1" />
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleOnchange}
              className="text-center form-control form-control-lg rounded-pill"
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary rounded-pill">
              Đăng nhập
            </button>
          </div>
        </form>
        {/* Đăng nhập MXH + Link }
        <div className="d-flex flex-column">
          <h5 className="text-center fw-semibold text-secondary">
            Đăng nhập với mạng xã hội
          </h5>
          <div className="gap-2 d-flex flex-column g-2">
            <div className="d-block">
              <div className="d-flex align-items-center justify-content-center">
                <button className="gap-2 btn btn-danger rounded-pill d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={faGoogle} />
                  Google
                </button>
              </div>
            </div>
            <h5 className="mt-3 text-center fw-semibold text-secondary">
              Chưa có tài khoản?
            </h5>
            <div className="gap-3 d-flex justify-content-center">
              <Link href="/register" className="btn btn-success rounded-pill">
                <FontAwesomeIcon icon={faUserPlus} /> Đăng ký
              </Link>
              <Link href="/" className="btn btn-dark rounded-pill">
                <FontAwesomeIcon icon={faHouse} /> Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}*/
