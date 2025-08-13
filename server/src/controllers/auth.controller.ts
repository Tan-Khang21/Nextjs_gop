import axios from "axios";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {
  handleDecodeToken,
  handleToken,
} from "../middleware/auth.middleware.ts";
type Request = express.Request;
type Response = express.Response;
const authRouter = express.Router();

//api url
const apiUrl = process.env.SERVER_API;
/*-----Router----- */
authRouter.post(`/login`, async (req, res) => {
  await login(req, res);
});
authRouter.get("/check-login", async (req, res) => {
  await checkLogin(req, res);
});
authRouter.post("/logout", async (req, res) => {
  await logout(req, res);
});
authRouter.post("/register", async (req, res) => {
  await register(req, res);
});

interface ResultRegisterResponse {
  success: boolean;
  message: string;
  data: {
    CustomerID: string;
    CustomerName: string;
    CustomerUsername: string;
    MaKH: string;
  };
}
export default authRouter;
/*----------controller--------*/
const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, tel, gender, address } = req.body;
    const response = await axios.post(`${apiUrl}/register.php`, {
      email,
      gender,
      address,
      password,
      tel,
      name,
    });
    const result: ResultRegisterResponse = response.data;
    return res.status(200).json({ mess: "Đăng ký", result });
  } catch (error) {
    return res.status(500).json({
      mess: `SERVER ERROR::${error}`,
    });
  }
};

interface DataLoginResponse {
  success: boolean;
  message: string;
  data: {
    CustomerID: string;
    CustomerName: string;
    MaKH: string;
  };
}

//login
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(404)
        .json({ mess: "You are not login or mail and password is not define" });
    }
    const result = await axios.post(`${apiUrl}/login.php`, {
      email,
      password,
    });
    const api: DataLoginResponse = result.data;

    if (api.success != true) {
      return res.status(400).json({
        mess: "Đăng nhập không thành công!",
        resultCode: 0,
      });
    }
    //tạo token cho phiên đăng nhập
    const token = await handleToken({
      email,
      password,
      MaKH: api.data.MaKH,
      CustomerID: api.data.CustomerID,
      CustomerName: api.data.CustomerName,
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Đăng nhập thành công!",
        resultCode: 1,
      });
  } catch (error) {
    return res.status(500).json({
      mess: `SERVER ERROR::${error}`,
      resultCode: 0,
    });
  }
};
//check  auth
const checkLogin = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        mess: "Bạn chưa đăng nhập hoặc token đã hết hạn vui lòng thử đăng nhập lại",
        resultCode: 0,
      });
    }
    const decoded = await handleDecodeToken(
      token,
      process.env.MY_SECRET_KEY as string
    );

    const userApi = await axios.get(
      `${apiUrl}/get.users.php?id=${decoded.users.MaKH}`
    );
    const users = userApi.data[0]; 
    if (!decoded) {
      return res.status(404).json({
        mess: "Không mã hóa được token, xác minh thất bại!",
        resultCode: 0,
      });
    }

    return res.status(200).json({
      mess: "Bạn đã đăng nhập - kiểm tra thành công",
      usersData: users,
      resultCode: 1,
    });
  } catch (error) {
    return res.status(500).json({
      mess: `SERVER ERROR::${error}`,
      resultCode: -1,
    });
  }
};
//logout
const logout = async (req: Request, res: Response) => {
  try {
    return res
      .clearCookie("token")
      .status(200)
      .json({ mess: "Đăng xuất thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ mess: `Đăng xuất thất bại:Lỗi:${error.toString()}` });
  }
};

