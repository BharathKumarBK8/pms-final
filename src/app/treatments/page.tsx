"use client";
import { useEffect, useState } from "react";
import Table from "../Components/Table";
import Layout from "../Components/Layout";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function TreatmentsPage() {
  const router = useRouter();
  const [treatments, setTreatments] = useState<any[]>([]);
  const columns = [
    { field: "id", header: "Treatment ID", sortable: true },
    { field: "patientId", header: "Patient ID", sortable: true },
    { field: "treatmentName", header: "Treatment", sortable: true },
    { field: "toothNumber", header: "Tooth #" },
    { field: "date", header: "Date", sortable: true },
    { field: "cost", header: "Cost", sortable: true },
    { field: "status", header: "Status", sortable: true },
  ];

  const handleAddTreatment = () => {
    router.push("/treatments/add");
  };

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/treatments");
        const json = await res.json();
        setTreatments(json);
      } catch (error) {
        console.error("Failed to fetch treatments", error);
      }
    };

    fetchTreatments();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Treatments</h1>
        <Button
          label="Add Treatment"
          icon="pi pi-plus"
          className="p-button-rounded p-button-success"
          onClick={handleAddTreatment}
        />
      </div>
      <Table data={treatments} columns={columns} />
    </Layout>
  );
}
