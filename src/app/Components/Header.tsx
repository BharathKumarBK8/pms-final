"use client";

import { FiBell, FiUser } from "react-icons/fi";

export default function Header() {
  return (
    <header className="w-full h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
      <h1 className="font-semibold text-lg">Patient Management System</h1>

      <div className="flex items-center gap-6">
        <FiBell size={22} className="text-gray-600 cursor-pointer" />
        <FiUser size={26} className="text-gray-700 cursor-pointer" />
      </div>
    </header>
  );
}
