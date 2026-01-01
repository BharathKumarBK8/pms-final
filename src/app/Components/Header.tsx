"use client";

import { FiBell, FiUser } from "react-icons/fi";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <h1>Patient Management System</h1>
      <div className="header-actions">
        <FiBell size={22} />
        <FiUser size={26} />
      </div>
    </header>
  );
}
