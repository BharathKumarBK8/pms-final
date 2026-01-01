"use client";

import Link from "next/link";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { LiaToothSolid } from "react-icons/lia";
import { RiBillLine } from "react-icons/ri";
import "./Sidebar.css";

const menuItems = [
  { name: "Dashboard", icon: <FiHome size={20} />, href: "/" },
  { name: "Patients", icon: <FiUsers size={20} />, href: "/patients" },
  {
    name: "Treatments",
    icon: <LiaToothSolid size={20} />,
    href: "/treatments",
  },
  { name: "Invoices", icon: <RiBillLine size={20} />, href: "/invoices" },
  {
    name: "Appointments",
    icon: <FiCalendar size={20} />,
    href: "/appointments",
  },
  { name: "Settings", icon: <FiSettings size={20} />, href: "/settings" },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <aside className="sidebar" style={{ width: open ? "256px" : "80px" }}>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        <FiMenu size={22} />
      </button>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} className="sidebar-item">
            <span>{item.icon}</span>
            {open && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
