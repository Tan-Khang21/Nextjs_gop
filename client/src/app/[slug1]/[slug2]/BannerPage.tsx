"use client";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function BannerPage() {
  const { headerContent } = useSelector((state: RootState) => state.contents);
  return (
    <div>
      {headerContent && headerContent.BannerChinh && (
        <div dangerouslySetInnerHTML={{ __html: headerContent.BannerChinh }} />
      )}
    </div>
  );
}
