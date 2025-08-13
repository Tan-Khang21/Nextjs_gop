// client/src/app/api/tintuc/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "35139"; // default if missing

  try {
    const response = await axios.get(
      `https://demodienmay.125.atoz.vn/ww2/module.tintuc.trangchu.asp`,
      { params: { id } }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}
