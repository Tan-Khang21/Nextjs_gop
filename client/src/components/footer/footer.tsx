"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { footerList, menuList } from "@/redux/utils";

export default function Footer() {
  return (
    <div className="bg-primary text-white pt-4 d-flex flex-column align-items-center justify-content-center">
      {/* Navigation */}
      <nav className="mb-3">
        <ul className="nav justify-content-center">
          {menuList.map((menu) => (
            <li key={menu.id} className="nav-item">
              <Link href={menu.url} className="nav-link text-white">
                <FontAwesomeIcon icon={menu.icon} className="ms-1" />
              </Link>
            </li>
          ))}
          <li className="nav-item">
            <span className="nav-link text-white"></span>
          </li>
        </ul>
      </nav>

      {/* Content */}
      <div className="bg-primary-second text-white w-75 p-4 rounded">
        <div className="row gy-3">
          <div className="col-12 col-md-3">
            <p>
              Chồi Xanh Media cung cấp các loại máy tính, laptop và thiết bị
              công nghệ chất lượng cao, đáp ứng mọi nhu cầu của doanh nghiệp và
              cá nhân.
            </p>
          </div>

          {footerList.map((group) => (
            <div key={group.id} className="col-6 col-md-3">
              {group.footer.map((ft) => (
                <a
                  href={ft.url}
                  key={ft.id}
                  className="d-flex align-items-center text-white text-decoration-none mb-2"
                >
                  {ft.icons.map(
                    (iconObj) =>
                      iconObj.content && (
                        <FontAwesomeIcon
                          key={iconObj.id}
                          icon={iconObj.content}
                          className="me-2"
                        />
                      )
                  )}
                  {ft.content}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
