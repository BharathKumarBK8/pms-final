"use client";
import { useEffect, useState } from "react";
import Table from "../Components/Table";
import Layout from "../Components/Layout";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../Components/ProtectedRoute";

export default function BillingsPage() {
  const [billings, setBillings] = useState<any[]>([]);
  const router = useRouter();
  const columns = [
    { field: "id", header: "Billing ID", sortable: true },
    { field: "treatmentId", header: "Treatment ID", sortable: true },
    { field: "totalCost", header: "Total Cost", sortable: true },
    { field: "discountAmount", header: "Discount Amount", sortable: true },
    { field: "finalAmount", header: "Final Amount", sortable: true },
    { field: "status", header: "Status", sortable: true },
  ];

  const handleAddBilling = () => {
    router.push("/billings/add");
  };

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/billings");
        const json = await res.json();
        setBillings(json);
      } catch (error) {
        console.error("Failed to fetch billings", error);
      }
    };

    fetchBillings();
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Billings</h1>
          <Button
            label="Add Billing "
            icon="pi pi-plus"
            className="btn-primary"
            onClick={handleAddBilling}
          />
        </div>
        <Table data={billings} columns={columns} />
      </Layout>
    </ProtectedRoute>
  );
}
