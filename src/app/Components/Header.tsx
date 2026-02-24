"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaBox,
  FaSignInAlt,
  FaUserCircle,
} from "react-icons/fa";
import { BsShop } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";

import styles from "./Header.module.css";
import { GiHeartPlus } from "react-icons/gi";

interface Logo {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface NavLink {
  name: string;
  href: string;
  icon?: any;
}

interface HeaderProps {
  logo?: Logo;
  navLinks?: NavLink[];
}

export default function Header({ logo }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, login } = useAuth();

  const handleLinkClick = () => setMenuOpen(false);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* ================= MOBILE HEADER ================= */}
        <div className={styles.mobileHeader}>
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <Link href="/" className={styles.mobileLogo} aria-label="Home">
            {logo?.src ? (
              <Image
                src={logo.src}
                alt={logo.alt ?? "Logo"}
                width={logo.width ?? 40}
                height={logo.height ?? 40}
              />
            ) : (
              <>
                <span className={styles.logoText}>myStore</span>
                <BsShop size={22} />
              </>
            )}
          </Link>
        </div>

        {/* ================= DESKTOP NAV ================= */}
        <div className={styles.navDesktop}>
          <Link href="/" className={styles.logo} aria-label="Home">
            {logo?.src ? (
              <Image
                src={logo.src}
                alt={logo.alt ?? "Logo"}
                width={logo.width ?? 60}
                height={logo.height ?? 60}
              />
            ) : (
              <>
                <GiHeartPlus size={32} />
                <span className={styles.logoText}>myPMS</span>
              </>
            )}
          </Link>

          <div className={styles.navActions}>
            <button className={styles.iconBtn} aria-label="Search">
              <FaSearch />
            </button>

            {isAuthenticated ? (
              <>
                {user?.role === "doctor" && (
                  <div className={styles.accountWrapper} ref={dropdownRef}>
                    <button
                      className={styles.iconBtn}
                      aria-label="Account"
                      onClick={() => setOpen((prev) => !prev)}
                    >
                      <FaUser />
                    </button>

                    {open && (
                      <div className={styles.dropdown}>
                        <div className={styles.userInfo}>
                          hi, <span>{user.displayName}</span>
                          <br />
                          <div className={styles.userEmail}>{user.email}</div>
                        </div>
                        <Link href="/admin" className={styles.dropdownItem}>
                          <BsShop /> View myStore
                        </Link>

                        <Link href="/account" className={styles.dropdownItem}>
                          <FaUser /> Account
                        </Link>
                        <Link href="/orders" className={styles.dropdownItem}>
                          <FaBox /> Orders
                        </Link>
                        <button
                          className={styles.dropdownItem}
                          onClick={logout}
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {user?.role === "staff" && (
                  <div className={styles.accountWrapper} ref={dropdownRef}>
                    <button
                      className={styles.iconBtn}
                      aria-label="Guest Account"
                      onClick={() => setOpen((prev) => !prev)}
                    >
                      <FaUser />
                    </button>

                    {open && (
                      <div className={styles.dropdown}>
                        <div className={styles.userInfo}>
                          hi, <span>{user.id}</span>
                        </div>
                        <button
                          className={styles.dropdownItem}
                          onClick={logout}
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.accountWrapper} ref={dropdownRef}>
                <button
                  className={styles.iconBtn}
                  aria-label=""
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <FaUser />
                </button>

                {open && (
                  <div className={styles.dropdown}>
                    <Link href="/login" className={styles.dropdownItem}>
                      <FaUserCircle /> Login
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (
        <div className={styles.navMobile}>
          {isAuthenticated ? (
            <>
              {user?.role === "doctor" && (
                <>
                  <div className={styles.userMobileGreeting}>
                    <span>hi,</span> {user.displayName}!
                    <br />
                    <div className={styles.userEmail}>{user.email}</div>
                  </div>
                  <Link
                    href="/account"
                    className={styles.navMobileLink}
                    onClick={handleLinkClick}
                  >
                    <FaUser style={{ marginRight: "8px" }} />
                    account.
                  </Link>
                  <button
                    className={styles.navMobileLink}
                    onClick={() => {
                      logout();
                      handleLinkClick();
                    }}
                  >
                    <FaSignOutAlt style={{ marginRight: "8px" }} />
                    logout.
                  </button>
                </>
              )}

              {user?.role === "staff" && (
                <>
                  <div className={styles.userMobileGreeting}>
                    <span>hi,</span> {user.id}!
                  </div>
                  <button
                    className={styles.navMobileLink}
                    onClick={() => {
                      logout();
                      handleLinkClick();
                    }}
                  >
                    <FaSignOutAlt style={{ marginRight: "8px" }} />
                    logout.
                  </button>
                </>
              )}
            </>
          ) : (
            <button className={styles.navMobileLink}>
              <FaSignInAlt style={{ marginRight: "8px" }} />
              Continue as Guest
            </button>
          )}

          <div className={styles.navMobileDivider}></div>
        </div>
      )}
    </header>
  );
}
