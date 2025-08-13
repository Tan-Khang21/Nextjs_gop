"use client";

import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function RightContent() {
  const { rightContent, navbar } = useSelector(
    (state: RootState) => state.contents
  );

  return (
    <div className="p-3 rounded">
      {rightContent.length > 0 && (
        <ul className="list-unstyled m-0 p-0">
          {rightContent.map((r) => {
            const parent = navbar?.find((nav) => nav.id == r.id);
            return (
              <li
                key={r.id}
                className="position-relative border-bottom py-2 group"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <Link
                    href={`/${
                      r.tieude === "Trang chủ"
                        ? "/"
                        : `${r.kieuhienthi.toLocaleLowerCase()}/${r.id}`
                    }`}
                    className="text-dark fw-semibold fs-6 d-flex align-items-center gap-1 text-decoration-none"
                  >
                    {r.tieude}
                    {parent && <FontAwesomeIcon icon={faChevronDown} />}
                  </Link>
                </div>

                {/* Dropdown */}
                {parent && parent.children && parent.children?.length > 0 && (
                  <ul className="dropdown-menu-custom list-unstyled">
                    {parent.children.map((mn) => (
                      <li key={mn.id}>
                        <Link
                          className="dropdown-item-custom"
                          href={`/${parent.kieuhienthi.toLocaleLowerCase()}/${
                            mn.id
                          }`}
                        >
                          {mn.tieude}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
