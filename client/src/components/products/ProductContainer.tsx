"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";

type AnyApiItem = Record<string, any>;

type Props = {
  id: string;
};

export default function ProductContainer({ id }: Props) {
  // Nếu bạn đã có logic fetch API rồi thì giữ nguyên;
  // mình giả định bạn đang set vào apiResponse { data: AnyApiItem[], recordsTotal?: number }
  const [apiResponse, setApiResponse] = useState<{ data?: AnyApiItem[]; recordsTotal?: number }>({
    data: [],
    recordsTotal: 0,
  });
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  // TODO: Giữ nguyên phần useEffect fetch API của bạn (mình không thay đổi)
  // useEffect(() => { ... setApiResponse({ data, recordsTotal }) }, [id]);

  const handleImageError = (imageUrl: string) => {
    setBrokenImages((s) => {
      if (s.has(imageUrl)) return s;
      const next = new Set(s);
      next.add(imageUrl);
      return next;
    });
  };

  const handleCartUpdate = () => {
    // TODO: bạn đã có logic cập nhật giỏ hàng thì giữ nguyên
  };

  const items = apiResponse.data || [];
  const total = apiResponse.recordsTotal || items.length;

  return (
    <section className="mb-4">
      <h6 className="mb-3 text-success border-bottom border-3 border-success">
        DANH SÁCH SẢN PHẨM{" "}
        {total ? <span className="text-muted">({total} sản phẩm)</span> : null}
      </h6>

      {items.length ? (
        <div className="row g-3">
          {items.map((item) => (
            <div className="col-6 col-md-4 col-lg-3" key={String(item.id ?? item.slug ?? Math.random())}>
              <ProductCard
                // 👇 ĐỔI thành p={item}
                p={item}
                brokenImages={brokenImages}
                onImageError={handleImageError}
                onCartUpdate={handleCartUpdate}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted m-0">Không có sản phẩm nào</p>
        </div>
      )}
    </section>
  );
}
