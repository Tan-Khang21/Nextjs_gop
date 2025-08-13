"use client";

import { getContentHeader } from "@/redux/api/reduxContentApi";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function HeaderTop() {
  const { headerMenu } = useSelector((state: RootState) => state.contents);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getContentHeader());
  }, [dispatch]);
  return (
    <div className="d-lg-block d-none">
      <nav className="navbar navbar-expand-lg navbar-dark px-3 py-2 bg-primary">
        <ul className="navbar-nav flex-column flex-lg-row gap-3 gap-lg-4 w-100 mb-0 flex-wrap">
          {/* dekstop menu */}
          {headerMenu?.map((nav) => (
            <li
              key={nav.idpart}
              className={`nav-item dropdown-center d-none d-lg-block ${
                nav.menucap1 ? "position-relative" : ""
              }`}
            >
              <Link
                href={`${nav.url}`}
                className={`nav-link text-white text-wrap fw-semibold ${
                  nav.menucap1 ? "dropdown-toggle" : ""
                }`}
              >
                {nav.tieude}
              </Link>
              {nav.menucap1 && (
                <ul className="dropdown-menu">
                  {nav.menucap1.map((item) => (
                    <li key={item.idpart}>
                      <Link className="dropdown-item" href={`${item.url}`}>
                        {item.tieude}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
