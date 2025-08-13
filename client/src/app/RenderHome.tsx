"use client";

import NewsPage from "@/components/news/NewsPage1";
import ProductContainer from "@/components/products/ProductContainer";
import ContactForm from "@/components/users/ContactForm";
import { getHomeContentApi } from "@/redux/api/reduxContentApi";
import { AppDispatch, RootState } from "@/redux/store";
import { Content } from "@/types/content.page.type";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarMenu from "@/components/sidebar/SidebarMenu";
import Reviews from "@/components/review/Reviews";

export default function RenderHome() {
  const dispatch = useDispatch<AppDispatch>();
  const { homeContent } = useSelector((state: RootState) => state.contents);
  useEffect(() => {
    const renderContentHome = async () => {
      await dispatch(getHomeContentApi());
    };
    renderContentHome();
  }, [dispatch]);
  if (!homeContent) return null; // Chưa có dữ liệu => không render gì
return (
  <div className="py-2">
    {homeContent && (
      <>
        {/* SẢN PHẨM */}
        {homeContent.filter((c: Content) => c.kieuhienthi === "Sanpham").length
          ? homeContent
              .filter((c: Content) => c.kieuhienthi === "Sanpham")
              .map((c: Content) => (
                <div key={`sp-${c.id}`}>
                  <ProductContainer id={(c.id ? String(c.id) : "35278")} />
                </div>
              ))
          : (
            <div key="sp-fallback">
              <ProductContainer id="35278" />
              <ProductContainer id="35279" />
            </div>
          )
        }

        {/* TIN TỨC */}
        {homeContent
          .filter((c: Content) => c.kieuhienthi === "Tintuc")
          .map((c: Content) => (
            <div key={`tt-${c.id}`}>
              <NewsPage id="tintuc" />
              <Reviews id="35281" sl={9} page={1} />
            </div>
          ))}

        {/* LIÊN HỆ */}
        {homeContent
          .filter((c: Content) => c.kieuhienthi === "Lienhe")
          .map((c: Content) => (
            <div key={`lh-${c.id}`}>
              <ContactForm id={String(c.id)} />
            </div>
          ))}
      </>
    )}
  </div>
);
}
