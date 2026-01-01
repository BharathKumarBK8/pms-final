"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ConfirmDialog } from "primereact/confirmdialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <ConfirmDialog />
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main
          className={`main-content ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
