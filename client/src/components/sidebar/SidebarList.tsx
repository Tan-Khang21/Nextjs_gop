"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface MenuItem {
  id: string;
  tieude: string;
  url: string;
  children?: MenuItem[];
}

type Props = {
  items: MenuItem[];
  /** mở sẵn các id ở cấp 1 (nếu muốn) */
  defaultOpenIds?: string[];
  /** chỉ cho mở 1 mục 1 lúc? (false = mở nhiều mục) */
  singleOpen?: boolean;
};

function ensureLeadingSlash(u?: string) {
  if (!u) return "#";
  return u.startsWith("/") ? u : `/${u}`;
}

export default function SidebarList({
  items,
  defaultOpenIds,
  singleOpen = false,
}: Props) {
  // trạng thái mở/đóng ở CẤP 1
  const initialOpen = useMemo(() => {
    if (defaultOpenIds?.length) {
      return Object.fromEntries(defaultOpenIds.map((id) => [id, true]));
    }
    // mặc định: mở mục đầu tiên có children (cho giống demo)
    const firstWithChildren = items.find((i) => i.children?.length)?.id;
    return firstWithChildren ? { [firstWithChildren]: true } : {};
  }, [items, defaultOpenIds]);

  const [open, setOpen] = useState<Record<string, boolean>>(initialOpen);
  const toggle = (id: string) =>
    setOpen((prev) => {
      if (!singleOpen) return { ...prev, [id]: !prev[id] };
      const next: Record<string, boolean> = {};
      Object.keys(prev).forEach((k) => (next[k] = false));
      next[id] = !prev[id];
      return next;
    });

  return (
    <div className="border rounded p-3 bg-white">
      {/* UL cấp 1 */}
      <ul className="list-unstyled m-0">
        {items.map((it, idx) => {
          const hasChildren = !!it.children?.length;
          const isOpen = !!open[it.id];

          return (
            <li key={it.id} className={idx !== 0 ? "border-top" : ""}>
              <div className="d-flex align-items-center justify-content-between py-2">
                {/* Trái: mũi tên + tiêu đề (tiêu đề là Link) */}
                <div className="d-flex align-items-center">
                  {/* mũi tên (nếu có con thì là nút toggle, còn không thì chỉ là icon tĩnh) */}
                  {hasChildren ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggle(it.id)}
                      className="btn btn-sm p-0 me-2 border-0 bg-transparent"
                      title={isOpen ? "Thu gọn" : "Mở rộng"}
                    >
                      {/* chevron inline svg */}
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        style={{
                          transition: "transform .2s",
                          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        }}
                      >
                        <path
                          d="M9 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ) : (
                    // leaf: icon tĩnh (không phải nút)
                    <span className="me-2" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path
                          d="M9 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ opacity: 0.6 }}
                        />
                      </svg>
                    </span>
                  )}

                  {/* Tiêu đề: là Link để điều hướng */}
                  <Link
                    href={ensureLeadingSlash(it.url)}
                    className="text-dark text-decoration-none fw-semibold"
                  >
                    {it.tieude}
                  </Link>
                </div>

                {/* Phải: dấu +/− nếu có children */}
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => toggle(it.id)}
                    className="btn btn-sm p-0 border-0 bg-transparent fw-bold"
                    aria-label={isOpen ? "Thu gọn" : "Mở rộng"}
                  >
                    {isOpen ? "−" : "+"}
                  </button>
                ) : (
                  <span />
                )}
              </div>

              {/* danh sách con */}
              {hasChildren && isOpen ? (
                <ul className="list-unstyled ms-4 mb-2">
                  {it.children!.map((c, cidx) => (
                    <li key={c.id} className={cidx !== 0 ? "border-top" : ""}>
                      <div className="py-2">
                        <Link
                          href={ensureLeadingSlash(c.url)}
                          className="text-body text-decoration-none"
                        >
                          {c.tieude}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
