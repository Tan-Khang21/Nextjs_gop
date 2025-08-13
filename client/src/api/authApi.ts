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

// Function to get DathangMabaogia cookie from API
export async function getDathangMabaogiayCookie() {
  try {
    console.log("🔥 [getDathangMabaogiayCookie] Calling cookie API...");
    
    const response = await axios.get('https://demodienmay.125.atoz.vn/ww1/cookie.mabaogia.asp');
    console.log("🔥 [getDathangMabaogiayCookie] Cookie API response:", response.data);
    
    // API trả về array, lấy DathangMabaogia từ phần tử đầu tiên
    const dathangData = response.data[0];
    const dathangValue = dathangData?.DathangMabaogia;
    
    if (dathangValue) {
      // Lưu vào localStorage
      localStorage.setItem('DathangMabaogia', dathangValue);
      console.log("🔥 [getDathangMabaogiayCookie] Saved DathangMabaogia to localStorage:", dathangValue);
      
      // Set cookie với thời hạn 365 ngày
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 365);
      document.cookie = `DathangMabaogia=${dathangValue}; path=/; expires=${expiryDate.toUTCString()}`;
      console.log("🔥 [getDathangMabaogiayCookie] Set DathangMabaogia cookie:", dathangValue);
      
      return dathangValue;
    }
    
    return null;
  } catch (error) {
    console.error("🔥 [getDathangMabaogiayCookie] Error:", error);
    return null;
  }
}

// Function to get ASP session cookie from current session
function getAspSessionCookie(): { name: string; value: string } | null {
  // Lấy từ localStorage nếu có
  const storedSessionName = localStorage.getItem('aspSessionName');
  const storedSessionValue = localStorage.getItem('aspSessionValue');
  
  if (storedSessionName && storedSessionValue) {
    return { name: storedSessionName, value: storedSessionValue };
  }
  
  // Lấy từ cookie hiện tại - tìm cookie bắt đầu với ASPSESSIONID
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name.startsWith('ASPSESSIONID')) {
      // Lưu vào localStorage để sử dụng lần sau
      localStorage.setItem('aspSessionName', name);
      localStorage.setItem('aspSessionValue', value);
      return { name, value };
    }
  }
  
  return null;
}

// Remove item from cart - Using Next.js API Route as proxy
export async function removeFromCart(idpart: string) {
  console.log("🔥 [removeFromCart] Function called with idpart:", idpart);
  
  try {
    // Hiển thị cookies hiện tại
    console.log("🔥 [removeFromCart] Current browser cookies:", document.cookie);
    
    // Lấy ASP session từ localStorage hoặc cookies
    const aspSession = getAspSessionCookie();
    console.log("🔥 [removeFromCart] ASP Session found:", aspSession);
    
    // Kiểm tra localStorage cho DathangMabaogia
    let dathangMabaogia = localStorage.getItem('DathangMabaogia');
    
    // Nếu chưa có DathangMabaogia, gọi API để lấy
    if (!dathangMabaogia) {
      console.log("🔥 [removeFromCart] DathangMabaogia not found, fetching from API...");
      dathangMabaogia = await getDathangMabaogiayCookie();
    }
    
    console.log("🔥 [removeFromCart] DathangMabaogia value:", dathangMabaogia);
    
    // Chuẩn bị data để gửi đến API Route
    const requestData = {
      idpart: idpart,
      aspSession: aspSession,
      dathangMabaogia: dathangMabaogia || '637'
    };
    
    console.log("🔥 [removeFromCart] Sending data to API Route:", requestData);
    
    // Gọi Next.js API Route
    const response = await fetch('/api/cart/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(requestData)
    });

    console.log("🔥 [removeFromCart] API Route response status:", response.status);
    
    const result = await response.json();
    console.log("🔥 [removeFromCart] API Route result:", result);
    
    return {
      success: result.success,
      message: result.message || "API call completed",
      data: result.data
    };
    
  } catch (error: unknown) {
    console.error("🔥 [removeFromCart] Error occurred:", error);
    
    return {
      success: false,
      message: "Có lỗi xảy ra khi xóa sản phẩm: " + (error instanceof Error ? error.message : String(error)),
      data: null
    };
  }
}

// Iframe method for CORS-safe cart removal
async function removeFromCartWithIframe(
  idpart: string, 
  aspSession: { name: string; value: string } | null, 
  dathangMabaogia: string
) {
  console.log("🔥 [removeFromCartWithIframe] Using iframe method");
  console.log("🔥 [removeFromCartWithIframe] ASP Session:", aspSession);
  console.log("🔥 [removeFromCartWithIframe] DathangMabaogia:", dathangMabaogia);
  
  return new Promise<{ success: boolean; message: string; data: string | null }>((resolve) => {
    try {
      // Set cookies trước khi iframe load để đảm bảo chúng được gửi
      if (aspSession) {
        // Set với domain chính và subdomain
        document.cookie = `${aspSession.name}=${aspSession.value}; path=/; domain=.125.atoz.vn`;
        document.cookie = `${aspSession.name}=${aspSession.value}; path=/`;
        console.log("🔥 [removeFromCartWithIframe] Set ASP Session cookie:", aspSession.name + "=" + aspSession.value);
      }
      
      // Set DathangMabaogia cookie
      document.cookie = `DathangMabaogia=${dathangMabaogia}; path=/; domain=.125.atoz.vn; expires=` + new Date(Date.now() + 365*24*60*60*1000).toUTCString();
      document.cookie = `DathangMabaogia=${dathangMabaogia}; path=/; expires=` + new Date(Date.now() + 365*24*60*60*1000).toUTCString();
      console.log("🔥 [removeFromCartWithIframe] Set DathangMabaogia cookie:", dathangMabaogia);
      
      // Verify cookies đã được set
      console.log("🔥 [removeFromCartWithIframe] Current cookies after setting:", document.cookie);
      
      // Tạo URL API với tất cả parameters cần thiết
      let apiUrl = `https://demodienmay.125.atoz.vn/cart/xoa.asp?choixanh=xoasanpham&idpart=${idpart}`;
      
      // Thêm cookies vào URL query string như backup (một số ASP server có thể đọc từ query)
      if (aspSession) {
        apiUrl += `&${aspSession.name}=${aspSession.value}`;
      }
      apiUrl += `&DathangMabaogia=${dathangMabaogia}`;
      
      console.log("🔥 [removeFromCartWithIframe] Final API URL:", apiUrl);
      
      // Tạo iframe ẩn
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.border = 'none';
      
      // Timeout để tránh treo
      const timeoutId = setTimeout(() => {
        console.log("🔥 [removeFromCartWithIframe] Timeout reached, cleaning up");
        try {
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        } catch {}
        resolve({
          success: true,
          message: "Đã gửi yêu cầu xóa sản phẩm (timeout)",
          data: "timeout-success"
        });
      }, 3000);
      
      iframe.onload = () => {
        console.log("🔥 [removeFromCartWithIframe] Iframe loaded successfully");
        clearTimeout(timeoutId);
        
        setTimeout(() => {
          try {
            if (iframe && iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
            console.log("✅ [removeFromCartWithIframe] Iframe removed, API call completed");
          } catch {}
          resolve({
            success: true,
            message: "Đã gửi yêu cầu xóa sản phẩm",
            data: "iframe-success"
          });
        }, 1000);
      };
      
      iframe.onerror = () => {
        console.error("❌ [removeFromCartWithIframe] Iframe failed to load");
        clearTimeout(timeoutId);
        try {
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        } catch {}
        resolve({
          success: false,
          message: "Không thể xóa sản phẩm",
          data: "iframe-error"
        });
      };
      
      // Thêm iframe vào DOM và load URL
      document.body.appendChild(iframe);
      iframe.src = apiUrl;
      console.log("🔥 [removeFromCartWithIframe] Iframe created and loading...");
      
    } catch {
      resolve({
        success: false,
        message: "Iframe method failed",
        data: null
      });
    }
  });
}