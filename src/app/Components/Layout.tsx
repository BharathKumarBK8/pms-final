"use client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ConfirmDialog } from "primereact/confirmdialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ConfirmDialog />
      <Header />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
