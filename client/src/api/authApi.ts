import { CheckLoginState } from "@/types/authType";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//login
export async function loginFunction({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const apiUrl = "https://demodienmay.125.atoz.vn/ww1/userlogin.asp";
    
    const params = new URLSearchParams({
      userid: email,
      pass: password,
    });

    const fullUrl = `${apiUrl}?${params.toString()}`;
    console.log("🔥 Calling Login API:", fullUrl);

    const response = await axios.get(fullUrl);
    console.log("🔥 Login API Response:", response.data);
    
    // API trả về mảng, lấy phần tử đầu tiên
    const data = response.data[0];
    console.log("🔥 Parsed Login Data:", data);
    
    // Kiểm tra kết quả đăng nhập
    if (data.maloi === "1") {
      // Đăng nhập thành công
      console.log("✅ Login Success");
      return {
        resultCode: 1,
        message: data.ThongBao,
        userData: {
          memberid: data.memberid,
          user: data.user,
          chucnang: data.chucnang,
          email: email
        }
      };
    } else {
      // Đăng nhập thất bại
      console.log("❌ Login Failed:", data.ThongBao);
      return {
        resultCode: 0,
        message: data.ThongBao,
        userData: null
      };
    }
  } catch (error) {
    console.error("🔥 Login API Error:", error);
    return {
      resultCode: 0,
      message: "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.",
      userData: null
    };
  }
}
//check login
export async function checkLogin() {
  const response = await axios.get(`${apiUrl}/auth/check-login`, {
    withCredentials: true,
  });
  const data: CheckLoginState = response.data;

  return data;
}
export interface FormDataRegister {
  email: string;
  tel: string;
  password: string;
  name: string;
  username: string;
}
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    CustomerID: string;
    CustomerName: string;
    CustomerUsername: string;
    MaKH: string;
  };
}
//register
export async function registerFunction({
  email,
  password,
  tel,
  name,
  username,
}: FormDataRegister) {
  try {
    const apiUrl = "https://demodienmay.125.atoz.vn/ww1/userlogin.asp";
    
    const params = new URLSearchParams({
      id2: "Chophepdangky",
      loaithanhvien: "1",
      tenkh: name,
      email: email,
      tel: tel,
      userid: username,
      pass: password,
    });

    const fullUrl = `${apiUrl}?${params.toString()}`;
    console.log("🔥 Calling Register API:", fullUrl);

    const response = await axios.get(fullUrl);
    console.log("🔥 Register API Response:", response.data);
    
    // Kiểm tra response từ API
    const responseText = response.data;
    const isSuccess = response.status === 200 && !responseText.includes("error") && !responseText.includes("Error");
    
    console.log("🔥 Register Success:", isSuccess);
    
    const result: RegisterResponse = {
      success: isSuccess,
      message: isSuccess ? "Đăng ký thành công!" : "Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.",
      data: {
        CustomerID: username,
        CustomerName: name,
        CustomerUsername: username,
        MaKH: username,
      },
    };
    
    return result;
  } catch (error: unknown) {
    // Xử lý lỗi
    console.error("🔥 Register API Error:", error);
    const result: RegisterResponse = {
      success: false,
      message: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.",
      data: {
        CustomerID: "",
        CustomerName: "",
        CustomerUsername: "",
        MaKH: "",
      },
    };
    return result;
  }
}
//logout function
export async function handleLogout() {
  await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
}
export function getFullImageUrl(imagePath: string) {
  if (!imagePath) return "/default-image.png";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  
  // Nếu imagePath bắt đầu bằng "//", thêm "https:" vào đầu
  if (imagePath.startsWith("//")) return "https:" + imagePath;
  
  // Đối với API này, base URL là https://demodienmay.125.atoz.vn
  const baseUrl = "https://demodienmay.125.atoz.vn";
  
  // Nếu imagePath bắt đầu bằng "/" thì ghép trực tiếp với baseUrl
  if (imagePath.startsWith("/")) {
    return `${baseUrl}${imagePath}`;
  }
  
  // Nếu không có "/", thêm "/" vào giữa
  return `${baseUrl}/${imagePath}`;
}