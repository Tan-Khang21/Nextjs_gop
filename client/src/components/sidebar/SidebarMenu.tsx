"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSidebarMenu } from "@/redux/slices/sidebarSlice";
import { RootState, AppDispatch } from "@/redux/store";
import Link from "next/link";

export default function SidebarMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const { menu } = useSelector((state: RootState) => state.sidebar);

  useEffect(() => {
    dispatch(fetchSidebarMenu());
  }, [dispatch]);

  return (
    <aside className="w-full max-w-[250px] bg-white border p-4">
      <h3 className="font-bold text-xl mb-4">Danh mục</h3>
      <ul className="space-y-2">
        {menu.map((item) => (
          <li key={item.idpart}>
            <Link href={`/${item.url}`} className="text-blue-600 hover:underline">
              {item.tieude}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
