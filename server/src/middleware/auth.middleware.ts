import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import md5 from "md5";
dotenv.config();
//verify token
export async function handleDecodeToken(token: string, serect_key: string) {
  const decodedToken = jwt.verify(token, serect_key) as {
    email: string;
    password: string;
    users: { CustomerID: string; CustomerName: string; MaKH: string };
  };
  return decodedToken;
}
interface TokenPayload {
  email: string;
  password: string;
  CustomerID: string;
  CustomerName: string;
  MaKH: string;
}
export async function handleToken({
  email,
  password,
  CustomerID,
  CustomerName,
  MaKH,
}: TokenPayload) {
  //mã hóa mật khẩu
  const hashpass = md5(password);
  const tokenPayload = {
    email,
    password: hashpass,
    users: {
      CustomerID,
      CustomerName,
      MaKH,
    },
  };
  const token = jwt.sign(tokenPayload, process.env.MY_SECRET_KEY as string, {
    expiresIn: "1d",
  });
  return token;
}
