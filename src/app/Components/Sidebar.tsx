"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", icon: <FiHome size={20} />, href: "/dashboard" },
  { name: "Patients", icon: <FiUsers size={20} />, href: "/patients" },
  {
    name: "Appointments",
    icon: <FiCalendar size={20} />,
    href: "/appointments",
  },
  { name: "Settings", icon: <FiSettings size={20} />, href: "/settings" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`h-screen bg-white border-r shadow-sm transition-all duration-300 
                 ${open ? "w-64" : "w-20"} flex flex-col`}
    >
      {/* Toggle Button */}
      <button className="p-4 flex items-center" onClick={() => setOpen(!open)}>
        <FiMenu size={22} />
      </button>

      {/* Menu */}
      <nav className="mt-4 flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 rounded-md hover:bg-gray-100"
          >
            <span className="text-blue-600">{item.icon}</span>
            {open && (
              <span className="text-gray-700 font-medium">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
