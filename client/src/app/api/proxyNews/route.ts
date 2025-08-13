// src/app/api/proxyNews/route.ts
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => (params[key] = value));

  try {
    const response = await axios.get(
      "https://demodienmay.125.atoz.vn/ww2/module.tintuc.chitiet.lienquan.asp?id=45386&sl=30&pageid=1",
      { params }
    );
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error fetching news" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
