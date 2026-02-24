"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUsers, FiCalendar, FiSettings, FiMenu } from "react-icons/fi";
import { LiaToothSolid } from "react-icons/lia";
import { RiBillLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const menuItems = [
    {
      name: "Patients",
      icon: <FiUsers size={20} />,
      href: "/patients",
      roles: ["owner", "admin", "doctor", "staff"],
    },
    {
      name: "Treatments",
      icon: <LiaToothSolid size={20} />,
      href: "/treatments",
      roles: ["owner", "admin", "doctor"],
    },
    {
      name: "Invoices",
      icon: <RiBillLine size={20} />,
      href: "/invoices",
      roles: ["owner", "admin"],
    },
    {
      name: "Appointments",
      icon: <FiCalendar size={20} />,
      href: "/appointments",
      roles: ["owner", "admin", "doctor", "staff"],
    },
    {
      name: "Settings",
      icon: <FiSettings size={20} />,
      href: "/settings",
      roles: ["owner", "admin"],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(user.role),
  );

  return (
    <aside className={`sidebar ${open ? "" : "collapsed"}`}>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        <FiMenu size={22} />
      </button>

      <nav className="sidebar-nav">
        {filteredItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-item ${isActive ? "active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
