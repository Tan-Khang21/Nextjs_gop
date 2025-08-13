"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SpinAnimation from "../items/SpinAnimation";
import { getProduct } from "@/redux/api/reduxContentApi";
import ProductCard from "./ProductCard";

export default function ProductContainer({ id }: { id: string }) {
  // Fetch sản phẩm
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.contents
  );
  
  // Track các ảnh bị lỗi
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  
  const handleImageError = (imageUrl: string) => {
    setBrokenImages(prev => new Set(prev).add(imageUrl));
  };
  
  // Handle cart update - có thể emit event hoặc trigger re-render
  const handleCartUpdate = () => {
    // Trigger a custom event để header có thể refresh cart count
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(getProduct({ id: id }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [dispatch, id]);
  
  if (loading == true) {
    return <SpinAnimation />;
  }

  return (
    <div>
      {products[id] && products[id].length > 0
        ? products[id].map((apiResponse) => (
            <section key={`section-${id}-${apiResponse.recordsTotal}`} className="py-4">
              <h6 className="fw-bold text-success border-bottom border-3 border-success">
                DANH SÁCH SẢN PHẨM ({apiResponse.recordsTotal} sản phẩm)
              </h6>
              {/* Hiển thị danh sách sản phẩm từ API mới */}
              <div className="d-block">
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
                  {apiResponse.data?.map((item) => (
                    <div className="col" key={item.id}>
                      <ProductCard
                        product={item}
                        brokenImages={brokenImages}
                        onImageError={handleImageError}
                        onCartUpdate={handleCartUpdate}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))
        : (
          <div className="text-center py-4">
            <p className="text-muted">Không có sản phẩm nào</p>
          </div>
        )}
    </div>
  );
}
