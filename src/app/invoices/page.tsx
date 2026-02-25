"use client";
import { useEffect, useState } from "react";
import Table from "../Components/Table";
import Layout from "../Components/Layout";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../Components/ProtectedRoute";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const router = useRouter();
  const columns = [
    { field: "id", header: "Invoice ID", sortable: true },
    { field: "casesheetId", header: "Casesheet ID", sortable: true },
    { field: "totalAmount", header: "Total Amount", sortable: true },
    { field: "discountAmount", header: "Discount Amount", sortable: true },
    { field: "finalAmount", header: "Final Amount", sortable: true },
    { field: "status", header: "Status", sortable: true },
  ];

  const handleAddInvoice = () => {
    router.push("/invoices/add");
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/invoices");
        const json = await res.json();
        setInvoices(json);
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Invoices</h1>
          <Button
            label="Add Invoice "
            icon="pi pi-plus"
            className="btn-primary"
            onClick={handleAddInvoice}
          />
        </div>
        <Table data={invoices} columns={columns} />
      </Layout>
    </ProtectedRoute>
  );
}
