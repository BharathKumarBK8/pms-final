"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle, FaSignOutAlt, FaBell } from "react-icons/fa";
import { GiHeartPlus } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";
import { FaGear } from "react-icons/fa6";

interface Logo {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface HeaderProps {
  logo?: Logo;
}

export default function Header({ logo }: HeaderProps) {
  const { user, isAuthenticated, logout, loading } = useAuth();
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
        {/* ================= LOGO ================= */}
        <Link href="/" className={styles.logo}>
          {logo?.src ? (
            <Image
              src={logo.src}
              alt={logo.alt ?? "Logo"}
              width={logo.width ?? 40}
              height={logo.height ?? 40}
            />
          ) : (
            <>
              <GiHeartPlus size={26} />
              <span className={styles.logoText}>myPMS</span>
            </>
          )}
        </Link>

        {/* ================= RIGHT SIDE ================= */}
        {isAuthenticated && (
          <div className={styles.actions}>
            {/* NOTIFICATIONS */}
            <button className={styles.iconBtn} aria-label="Notifications">
              <FaBell />
            </button>

            {/* USER DROPDOWN */}
            <div className={styles.accountWrapper} ref={dropdownRef}>
              <button
                className={styles.userBtn}
                onClick={() => setOpen((prev) => !prev)}
              >
                <FaUserCircle size={22} />
                <span className={styles.userName}>{user?.displayName}</span>
              </button>

              {open && (
                <div className={styles.dropdown}>
                  <div className={styles.userInfo}>
                    <strong>{user?.displayName}</strong>
                    <div>{user?.email}</div>
                    <div className={styles.roleBadge}>{user?.role}</div>
                  </div>

                  <Link href="/account" className={styles.dropdownItem}>
                    <FaGear /> Settings
                  </Link>

                  <button className={styles.dropdownItem} onClick={logout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
