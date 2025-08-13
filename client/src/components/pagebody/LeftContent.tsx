"use client";

import { RootState } from "@/redux/store";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

export default function LeftContent() {
  const { leftContent, navbar } = useSelector(
    (state: RootState) => state.contents
  );
  return (
    <div className="p-3 rounded">
      {leftContent.length > 0 && (
        <ul className="list-unstyled m-0 p-0">
          {leftContent.map((l) => {
            const parent = navbar?.find((nav) => nav.id == l.id);
            return (
              <li
                key={l.id}
                className="border-bottom position-relative py-2 group"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <Link
                    href={`/${
                      l.tieude === "Trang chủ"
                        ? "/"
                        : `${l.kieuhienthi.toLocaleLowerCase()}/${l.id}`
                    }`}
                    className="text-dark fw-semibold fs-6 d-flex align-items-center gap-1 text-decoration-none"
                  >
                    {l.tieude}
                    {parent && <FontAwesomeIcon icon={faChevronDown} />}
                  </Link>
                </div>

                {/* Dropdown */}
                {parent && parent.children && parent.children.length > 0 && (
                  <ul className="dropdown-menu-custom list-unstyled">
                    {parent.children?.map((mn) => (
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
