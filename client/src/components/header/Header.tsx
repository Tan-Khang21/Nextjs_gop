"use client";

import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faCartArrowDown,
  faSearch,
  faBars,
  faTimes,
  faUser,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { headerTopMenuListLeft, headerTopMenuListRight } from "@/api/ListApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { handleLogout } from "@/api/authApi";
import { useRouter } from "next/navigation";
import GuestCart from "../cart/GuestCart";
import { useGuestCart } from "@/hooks/useGuestCart";

export default function Header() {
  const { loggedIn, users } = useSelector((state: RootState) => state.auths);
  const { navbar, headerContent } = useSelector(
    (state: RootState) => state.contents
  );
  const [search, setSearch] = useState<string>();

  const [navOpen, setNavOpen] = useState(false);
  const [openMenuChild, setOpenMenuChild] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  const { getTotalItems, refreshCart } = useGuestCart();
  const cartCount = getTotalItems();
  
  // Debug log for cart count changes
  useEffect(() => {
    console.log("🔥 [Header] Cart count updated:", cartCount);
  }, [cartCount]);
  
  const cartDropdownRef = useRef<HTMLDivElement>(null);

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    };

    if (cartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartOpen]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log("🔥 [Header] Received cartUpdated event, refreshing cart...");
      refreshCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [refreshCart]);

  const logout = async () => {
    await handleLogout();
    window.location.reload();
  };

  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?keyword=${search}`);
  };
  return (
    <div className="px-3 py-2 text-white shadow-sm bg-success">
      {/* ===== Top Bar ===== */}
      <div className="d-flex justify-content-between align-items-center small">
        {/* Left menu */}
        <ul className="flex-wrap gap-2 mb-0 d-flex gap-md-3 list-unstyled">
          {headerTopMenuListLeft.map((menu) => (
            <li key={menu.id}>
              <Link
                href={""}
                className="gap-1 text-white text-decoration-none d-flex align-items-center hover-opacity"
              >
                <FontAwesomeIcon icon={menu.icon} />
                <span className="d-none d-md-inline">{menu.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right menu */}
        <ul className="flex-wrap gap-2 mb-0 d-flex gap-md-3 list-unstyled">
          {loggedIn && (
            <li className="dropdown-center">
              <Link
                className="gap-1 text-white text-decoration-none d-flex align-items-center hover-opacity"
                href={"/users"}
              >
                <FontAwesomeIcon icon={faUser} />
                {users?.name}
              </Link>
            </li>
          )}

          {headerTopMenuListRight.map((menu) => (
            <li className="dropdown-center" key={menu.id}>
              <Link
                href={menu.url}
                onClick={() =>
                  menu.menuchild ? setOpenMenuChild(!openMenuChild) : () => null
                }
                className={`text-white nav-link${
                  menu.menuchild ? " dropdown-toggle" : ""
                }`}
              >
                <FontAwesomeIcon icon={menu.icon} /> {menu.name}
              </Link>
              {openMenuChild && menu.menuchild && (
                <ul className="gap-2 p-2 bg-white rounded list-unstyled ms-4 position-absolute d-flex text-dark flex-column">
                  {menu.menuchild.map((child) => (
                    <li key={child.id}>
                      <Link className="dropdown-item" href={child.url}>
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Logout button */}
          {loggedIn && (
            <li>
              <button
                className="text-white bg-transparent border-0"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* ===== Middle Bar ===== */}
      <div className="flex-wrap gap-3 py-3 d-flex align-items-center justify-content-between">
        {/* Logo */}
        <Link href="/" className="px-2">
          {headerContent && (
            <Image
              src={`https://choixanh.net/mediaroot/media/userfiles/useruploads/6/image/he-thong/logo-10.png`}
              alt="logo"
              title="choixanhmedia.com.vn"
              width={126}
              height={10}
              style={{ inlineSize: "126px", blockSize: "10px" }}
              className="object-fit-cover"
            />
          )}
        </Link>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="gap-1 mx-2 d-flex flex-grow-1"
          style={{ maxInlineSize: "600px", minInlineSize: "200px" }}
        >
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 bg-white form-control text-dark rounded-start"
            placeholder="Tìm kiếm sản phẩm..."
          />
          <button className="border btn btn-light rounded-end">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        {/* Mobile Toggle Button */}
        <div className="d-lg-none d-block">
          <button
            className="btn btn-light"
            onClick={() => setNavOpen(!navOpen)}
          >
            <FontAwesomeIcon icon={navOpen ? faTimes : faBars} />
          </button>
        </div>

        {/* Desktop Action Icons */}

        <div className="gap-2 d-lg-flex d-none">
          {/* Cart Dropdown */}
          <div className="dropdown position-relative" ref={cartDropdownRef}>
            <button
              className="btn btn-outline-light rounded position-relative"
              onClick={() => setCartOpen(!cartOpen)}
              type="button"
            >
              <FontAwesomeIcon icon={faCartArrowDown} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </button>
            {cartOpen && (
              <div 
                className="dropdown-menu show position-absolute" 
                style={{ 
                  right: '0', 
                  left: 'auto', 
                  width: '400px', 
                  maxHeight: '500px', 
                  overflowY: 'auto',
                  zIndex: 1050
                }}
              >
                <div className="p-3">
                  <GuestCart />
                </div>
              </div>
            )}
          </div>
          
          <Link
            href={loggedIn ? "/wishlist" : "/login"}
            className="rounded btn btn-outline-light"
          >
            <FontAwesomeIcon icon={faHeart} />
          </Link>
          <Link
            href={loggedIn ? "/order-history" : "/login"}
            className="rounded btn btn-outline-light"
          >
            <FontAwesomeIcon icon={faShoppingBag} />
          </Link>
        </div>
      </div>

      {/* ===== Navbar ===== */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark rounded px-3 py-2 ${
          navOpen ? "" : "d-none d-lg-block"
        }`}
      >
        <ul className="flex-wrap gap-3 mb-0 navbar-nav flex-column flex-lg-row gap-lg-4 w-100 justify-content-center">
          {/* Desktop menu */}
          {navbar?.map((nav) => (
            <li
              key={nav.id}
              className={`nav-item dropdown-center d-none d-lg-block ${
                nav.children ? "position-relative" : ""
              }`}
            >
              <Link
                href={`/${
                  nav.tieude === "Trang chủ"
                    ? "/"
                    : `${nav.kieuhienthi.toLowerCase()}/${nav.id}`
                }`}
                className={`nav-link text-white fw-semibold text-wrap ${
                  nav.children ? "dropdown-toggle" : ""
                }`}
                onClick={() => setNavOpen(false)}
              >
                {nav.tieude}
              </Link>
              {nav.children && (
                <ul className="dropdown-menu">
                  {nav.children.map((item) => (
                    <li key={item.id}>
                      <Link
                        className="dropdown-item text-wrap"
                        href={`/${nav.kieuhienthi.toLowerCase()}/${item.id}`}
                        onClick={() => setNavOpen(false)}
                      >
                        {item.tieude}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          {/* Divider for mobile */}
          <span className="d-block d-lg-none">
            <hr />
          </span>
          {/* Mobile navbar from navbar */}
          {navbar?.map((nav) => (
            <li key={nav.id} className="dropend d-lg-none position-relative">
              <Link
                href={`/${
                  nav.tieude === "Trang chủ"
                    ? "/"
                    : `${nav.kieuhienthi.toLowerCase()}/${nav.id}`
                }`}
                className={`nav-link text-white fw-semibold text-wrap ${
                  nav.children ? "dropdown-toggle" : ""
                }`}
                onClick={() => setNavOpen(false)}
              >
                {nav.tieude}
              </Link>
              {nav.children && (
                <ul className="dropdown-menu position-absolute">
                  {nav.children.map((item) => (
                    <li key={item.id}>
                      <Link
                        className="dropdown-item text-wrap"
                        href={`/${nav.kieuhienthi.toLocaleLowerCase()}/${
                          item.id
                        }`}
                        onClick={() => setNavOpen(false)}
                      >
                        {item.tieude}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          {/* Mobile Action Buttons */}
          <li className="gap-2 d-flex d-lg-none">
            <Link
              href={loggedIn ? "/gio-hang" : "/login"}
              className="text-white border rounded btn"
            >
              <FontAwesomeIcon icon={faCartArrowDown} />
            </Link>
            <Link
              href={loggedIn ? "/wishlist" : "/login"}
              className="text-white border rounded btn"
            >
              <FontAwesomeIcon icon={faHeart} />
            </Link>
            <Link
              href={loggedIn ? "/order-history" : "/login"}
              className="text-white border rounded btn"
            >
              <FontAwesomeIcon icon={faShoppingBag} />
            </Link>
          </li>{" "}
        </ul>
      </nav>
    </div>
  );
}
