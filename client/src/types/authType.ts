import { RegisterResponse } from "@/api/authApi";

// ─── INTERFACE: Đăng nhập & Đăng ký ─────────────────────────────
export interface LoginResponse {
  resultCode: number;
  message: string;
  userData?: {
    memberid: string;
    user: string;
    chucnang: string;
    email: string;
  } | null;
}

export interface CheckLoginState {
  mess: string;
  usersData: UserInfo;
  resultCode: number;
}

export interface checkAuthResponse {
  user: string;
  memberid: number;
  chucnang: number;
  userForm: Users[];
  resultCode: number;
}

// ─── INTERFACE: Form người dùng ─────────────────────────────────
export interface Users {
  tennhom: string;
  cauhinh: {
    tieude: string;
    kieu: string;
    nhandan: string;
    batbuoc: boolean;
    sua: boolean;
    huongdan: string;
    giatri: string;
    nhom: string;
  };
}
//dữ liệu người dùng
export interface UserInfo {
  id: string;
  userId: string;
  email: string;
  name: string;
  phone:string
  userCode: string;
  avt: string;
  birthday: string;
  gender: string;
  address: string;
}
// ─── INTERFACE: Auth State ─────────────────────────────────────
export interface AuthState {
  loading: boolean;
  error: string | null;
  loggedIn: boolean | null;
  users: UserInfo | null;
  registerResponse: RegisterResponse | null;
  userForm: Users[] | null;
  resultCode: number | null;
  loginMessage: string | null;
}

// ─── INITIAL STATE ─────────────────────────────────────────────
export const initialState: AuthState = {
  loading: false,
  error: null,
  registerResponse: null,
  users: null,
  userForm: null,
  loggedIn: null,
  resultCode: null,
  loginMessage: null,
};
