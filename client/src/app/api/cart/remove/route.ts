// app/api/cart/remove/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { idpart } = await request.json();
    if (!idpart) {
      return NextResponse.json({ success: false, message: 'Missing idpart parameter' }, { status: 400 });
    }

    const apiUrl = 'https://demochung.125.atoz.vn/cart/xoa.asp';
    const params = new URLSearchParams({ choixanh: 'xoasanpham', idpart });
    const fullUrl = `${apiUrl}?${params.toString()}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const upstream = await fetch(fullUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
        'User-Agent': 'Mozilla/5.0',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });

    clearTimeout(timer);

    const body = await upstream.text();
    const origin = request.headers.get('origin') || '*';

    return NextResponse.json(
      {
        success: upstream.ok,
        message: upstream.ok ? 'Đã xóa sản phẩm khỏi giỏ hàng' : 'Có lỗi khi xóa sản phẩm',
        data: body,
        status: upstream.status
      },
      {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': 'true',
          'Vary': 'Origin'
        }
      }
    );
  } catch (error: any) {
    const origin = request.headers.get('origin') || '*';
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi xóa sản phẩm', error: String(error?.message || error) },
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
