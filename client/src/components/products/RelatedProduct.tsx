import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";

export default function Relatedproduct() {
  const { productRelated } = useSelector((state: RootState) => state.contents);
  
  // Track các ảnh bị lỗi
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  
  const handleImageError = (imageUrl: string) => {
    setBrokenImages(prev => new Set(prev).add(imageUrl));
  };

  // Convert ProductRelatedData to ProductCardProps format
  const convertToProductCardFormat = (relatedProduct: {
    id: string;
    tieude: string;
    hinhdaidien: string;
    gia: string;
    giakhuyenmai: string;
    thuonghieu: string;
  }) => {
    return {
      id: relatedProduct.id,
      tieude: relatedProduct.tieude,
      hinhdaidien: relatedProduct.hinhdaidien,
      gia: relatedProduct.gia,
      giakhuyenmai: relatedProduct.giakhuyenmai,
      thuonghieu: relatedProduct.thuonghieu ? [{ tengoi: relatedProduct.thuonghieu, url: "" }] : undefined,
    };
  };

  return (
    <div>
      <div>
        {productRelated ? (
          <section className="py-4">
            <h6 className="fw-bold text-success border-bottom border-3 border-success">
              {productRelated.tieude?.toString().toLocaleUpperCase()}
            </h6>

            {/* Hiển thị danh sách sản phẩm */}
            <div className="d-block">
              <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
                {productRelated.data?.map((product) => (
                  <div className="col" key={product.id}>
                    <ProductCard
                      product={convertToProductCardFormat(product)}
                      brokenImages={brokenImages}
                      onImageError={handleImageError}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
