// app/api/cart/remove/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log("🔥 [API Route] POST method called - Starting remove cart process");
  
  try {
    console.log("🔥 [API Route] Parsing request body...");
    const { idpart, aspSession, dathangMabaogia } = await request.json();
    
    console.log("🔥 [API Route] Parsed data:", { idpart, aspSession, dathangMabaogia });
    
    if (!idpart) {
      console.log("🔥 [API Route] Missing idpart parameter");
      return NextResponse.json({ success: false, message: 'Missing idpart parameter' }, { status: 400 });
    }

    // Tạo cookie string từ client data
    let cookieString = '';
    
    if (aspSession && aspSession.name && aspSession.value) {
      cookieString += `${aspSession.name}=${aspSession.value}; `;
      console.log("🔥 [API Route] Added ASP Session to cookies:", aspSession.name + "=" + aspSession.value);
    }
    
    if (dathangMabaogia) {
      cookieString += `DathangMabaogia=${dathangMabaogia}; `;
      console.log("🔥 [API Route] Added DathangMabaogia to cookies:", dathangMabaogia);
    }
    
    // Thêm cookies từ client request nếu có
    const clientCookies = request.headers.get('cookie') || '';
    if (clientCookies) {
      cookieString += clientCookies + '; ';
      console.log("🔥 [API Route] Added client cookies:", clientCookies);
    }
    
    console.log("🔥 [API Route] Final cookie string:", cookieString);

    const apiUrl = 'https://demodienmay.125.atoz.vn/cart/xoa.asp';
    const params = new URLSearchParams({ choixanh: 'xoasanpham', idpart });
    const fullUrl = `${apiUrl}?${params.toString()}`;
    
    console.log("🔥 [API Route] Calling external API with cookies:", fullUrl);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const upstream = await fetch(fullUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cookie': cookieString, // Sử dụng cookie string đã tạo
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });

    clearTimeout(timer);
    
    console.log("🔥 [API Route] Fetch completed with status:", upstream.status);
    console.log("🔥 [API Route] Fetch ok:", upstream.ok);
    console.log("🔥 [API Route] Response headers from ASP:", Object.fromEntries(upstream.headers.entries()));

    const body = await upstream.text();
    console.log("🔥 [API Route] Response body:", body.substring(0, 500)); // Chỉ log 500 ký tự đầu
    
    // Lấy set-cookie headers từ ASP response
    const setCookieHeaders = upstream.headers.get('set-cookie');
    console.log("🔥 [API Route] Set-Cookie headers from ASP:", setCookieHeaders);
    
    const origin = request.headers.get('origin') || '*';

    // Tạo response
    const response = NextResponse.json(
      {
        success: upstream.ok,
        message: upstream.ok ? 'Đã xóa sản phẩm khỏi giỏ hàng' : 'Có lỗi khi xóa sản phẩm',
        data: {
          body: body,
          status: upstream.status,
          aspCookies: setCookieHeaders
        }
      },
      {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': 'true',
          'Vary': 'Origin'
        }
      }
    );

    // Forward cookies từ ASP response về client
    if (setCookieHeaders) {
      // Nếu có nhiều cookies, split và add từng cái
      const cookies = setCookieHeaders.split(',');
      cookies.forEach(cookie => {
        response.headers.append('Set-Cookie', cookie.trim());
      });
      console.log("🔥 [API Route] Forwarded cookies to client");
    }

    return response;
  } catch (error: unknown) {
    console.error("🔥 [API Route] Error occurred:", error);
    
    const origin = request.headers.get('origin') || '*';
    
    // Log chi tiết lỗi
    if (error instanceof Error) {
      console.error("🔥 [API Route] Error name:", error.name);
      console.error("🔥 [API Route] Error message:", error.message);
      console.error("🔥 [API Route] Error stack:", error.stack);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Có lỗi xảy ra khi xóa sản phẩm', 
        error: error instanceof Error ? error.message : String(error)
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': 'true',
          'Vary': 'Origin'
        }
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin'
    }
  });
}
