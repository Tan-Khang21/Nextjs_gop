import { initialState } from "@/types/authType";
import { createSlice } from "@reduxjs/toolkit";
import { checkAuth, login, register } from "../api/reduxAuthApi";

// ------------------------ Slice ------------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Kiểm tra đăng nhập
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loggedIn = true;
        state.users = action.payload.usersData;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Đăng nhập
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.resultCode = action.payload.resultCode;
        state.loginMessage = action.payload.message;
        if (action.payload.userData) {
          state.users = {
            id: action.payload.userData.memberid,
            userId: action.payload.userData.user,
            email: action.payload.userData.email,
            name: action.payload.userData.user,
            phone: "",
            userCode: action.payload.userData.memberid,
            avt: "",
            birthday: "",
            address: "",
            gender: "",
          };
        }
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.resultCode = 0;
        state.error = "Lỗi đăng nhập";
        state.loginMessage = "Đăng nhập thất bại";
      })
      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.registerResponse = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload ?? "Lỗi đăng ký";
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
