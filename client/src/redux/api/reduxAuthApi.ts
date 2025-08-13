// ------------------------ Async Thunks ------------------------

import {
  checkLogin,
  loginFunction,
  registerFunction,
  RegisterResponse,
} from "@/api/authApi";
import { CheckLoginState, LoginResponse } from "@/types/authType";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Đăng nhập
export const login = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, thunkAPI) => {
  try {
    const payload = await loginFunction({ email: email, password: password });
    return {
      resultCode: payload.resultCode,
      message: payload.message,
      userData: payload.userData ?? null
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Đăng nhập thất bại");
    }
    return thunkAPI.rejectWithValue("Lỗi server");
  }
});
// Kiểm tra đăng nhập
export const checkAuth = createAsyncThunk<
  CheckLoginState,
  void,
  { rejectValue: string }
>("auth/checkAuth", async (_, thunkAPI) => {
  try {
    const payload = await checkLogin();
    if (payload.resultCode != 1) {
      return thunkAPI.rejectWithValue("lỗi");
    }
    return payload;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Lỗi khi gọi API");
    }
    return thunkAPI.rejectWithValue("Lỗi không xác định");
  }
});

export const register = createAsyncThunk<
  RegisterResponse,
  {
    name: string;
    username: string;
    password: string;
    email: string;
    tel: string;
  },
  { rejectValue: string }
>(
  "register",
  async ({ email, name, username, password, tel }, thunkAPI) => {
    try {
      const res = await registerFunction({
        email,
        password,
        name,
        tel,
        username,
      });
      return res;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue("Lỗi khi gọi API");
      }
      return thunkAPI.rejectWithValue("Lỗi không xác định");
    }
  }
);
