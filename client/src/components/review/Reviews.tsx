"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Review = {
  id: string;
  tieude: string;          // tên người đánh giá
  url: string;
  hinhdaidien?: string;
  noidungtomtat?: string;  // HTML
};

function ReviewCard({ r, active }: { r: Review; active: boolean }) {
  return (
    <article
      className={`bg-white rounded-xl border transition-all duration-400 ease-out
                  ${active ? "shadow-md opacity-100 scale-100 border-emerald-200" : "opacity-60 scale-95 border-slate-200"}
                  w-[260px] h-[200px] p-3`}
    >
      <div className="flex items-center gap-3 mb-2">
        {r.hinhdaidien ? (
          <Image
            src={r.hinhdaidien}
            alt={r.tieude}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
            🧑
          </div>
        )}
        {/* Tên to hơn nội dung */}
        <div className="font-bold text-slate-900 text-lg truncate">
          {r.tieude}
        </div>
      </div>

      {/* Nội dung nhỏ hơn tên */}
      <div
        className={`text-[13px] leading-6 ${active ? "text-slate-700" : "text-slate-500"}`}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: active ? 5 : 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: r.noidungtomtat || "" }}
      />
    </article>
  );
}

export default function Reviews({
  id = "35281",
  sl = 9,
  page = 1,
  autoplayMs = 3500,
}: {
  id?: string;
  sl?: number;
  page?: number;
  autoplayMs?: number;
}) {
  const [items, setItems] = useState<Review[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // fetch API
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(
          `https://demodienmay.125.atoz.vn/ww2/module.tintuc.asp?id=${id}&sl=${sl}&pageid=${page}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        const block = Array.isArray(data) ? data[0] : null;
        if (!alive) return;
        setItems((block?.data as Review[]) ?? []);
        setIndex(0);
      } catch {
        if (alive) setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, sl, page]);

  // autoplay
  useEffect(() => {
    if (!items.length || paused) return;
    timerRef.current = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      autoplayMs
    );
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [items.length, paused, autoplayMs]);

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);
  const get = (i: number) => (i < 0 ? items.length - 1 : i >= items.length ? 0 : i);

  if (!items.length) return null;

  const left = items[get(index - 1)];
  const center = items[index];
  const right = items[get(index + 1)];

  return (
    <section
      className="mt-10 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Đánh giá khách hàng"
    >
      {/* Tiêu đề: xanh + gạch ngang giống phần Tin tức */}
      <h5 className="text-2xl font-semibold text-emerald-700">ĐÁNH GIÁ KHÁCH HÀNG</h5>
      <div className="h-[3px] w-40 bg-emerald-600 rounded mt-2 mb-6" />

      <div className="relative max-w-[980px] mx-auto">
        {/* mờ 2 mép để preview */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent" />

        {/* 3 thẻ ngang: trái – giữa – phải */}
        <div className="flex items-center justify-center gap-4 overflow-hidden px-20">
          <ReviewCard r={left} active={false} />
          <ReviewCard r={center} active={true} />
          <ReviewCard r={right} active={false} />
        </div>

        {/* Prev / Next TO (56px) với SVG icon to ⇒ chắc chắn to */}
        <button
          aria-label="Prev"
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                     w-14 h-14 rounded-full bg-white/95 border shadow hover:bg-emerald-50
                     flex items-center justify-center"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e2e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          aria-label="Next"
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                     w-14 h-14 rounded-full bg-white/95 border shadow hover:bg-emerald-50
                     flex items-center justify-center"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e2e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Đánh giá ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-emerald-600" : "w-2.5 bg-emerald-300"}`}
          />
        ))}
      </div>
    </section>
  );
}
