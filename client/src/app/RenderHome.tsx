"use client";

import NewsPage from "@/components/news/NewsPage";
import ProductContainer from "@/components/products/ProductContainer";
import ContactForm from "@/components/users/ContactForm";
import { getHomeContentApi } from "@/redux/api/reduxContentApi";
import { AppDispatch, RootState } from "@/redux/store";
import { Content } from "@/types/content.page.type";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function RenderHome() {
  const dispatch = useDispatch<AppDispatch>();
  const { homeContent } = useSelector((state: RootState) => state.contents);
  useEffect(() => {
    const renderContentHome = async () => {
      await dispatch(getHomeContentApi());
    };
    renderContentHome();
  }, [dispatch]);

  return (  
    <div className="py-2">
      {homeContent &&
        homeContent.map((content: Content) => {
          if (content.kieuhienthi === "Sanpham") {
            return (
              <div key={content.id}>
                <ProductContainer id={content.id.toString()} />
              </div>
            );
          }
          if (content.kieuhienthi === "Tintuc") {
            return (
              <div key={content.id}>
                <NewsPage id={content.id.toString()} />
              </div>
            );
          }
          if (content.kieuhienthi === "Lienhe") {
            return (
              <div key={content.id}>
                <ContactForm id={content.id.toString()} />
              </div>
            );
          }
          return null;
        })}
    </div>
  );
}
