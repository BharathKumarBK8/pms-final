"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Table from "../Components/Table";
import Layout from "../Components/Layout";
import { Button } from "primereact/button";
import ProtectedRoute from "../Components/ProtectedRoute";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const router = useRouter();
  const columns = [
    { field: "id", header: "Payment ID", sortable: true },
    { field: "invoiceId", header: "Invoice ID", sortable: true },
    { field: "paymentAmount", header: "Payment Amount", sortable: true },
    { field: "paymentDate", header: "Payment Date", sortable: true },
    { field: "paymentMode", header: "Payment Mode", sortable: true },
    { field: "status", header: "Status", sortable: true },
  ];

  const handleAddPayment = () => {
    router.push("/payments/add");
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/payments");
        const json = await res.json();
        setPayments(json);
      } catch (error) {
        console.error("Failed to fetch payments", error);
      }
    };

    fetchPayments();
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Payments</h1>
          <Button
            label="Add Payment "
            icon="pi pi-plus"
            className="btn-primary"
            onClick={handleAddPayment}
          />
        </div>
        <Table data={payments} columns={columns} />
      </Layout>
    </ProtectedRoute>
  );
}
