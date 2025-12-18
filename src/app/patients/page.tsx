"use client";
import { useEffect, useState } from "react";
import Table from "../Components/Table";
import Layout from "../Components/Layout";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);

  const columns = [
    { field: "id", header: "Patient ID", sortable: true },
    { field: "name", header: "Name", sortable: true },
    { field: "age", header: "Age", sortable: true },
    { field: "gender", header: "Gender", sortable: true },
    { field: "phone", header: "Phone" },
    { field: "status", header: "Status", sortable: true },
  ];

  const handleEdit = (rowData: any) => {
    router.push(`/patients/edit/${rowData.id}`);
  };

  const handleView = (rowData: any) => {
    router.push(`/patients/view/${rowData.id}`);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/patients");
        const json = await res.json();
        setPatients(json);
      } catch (error) {
        console.error("Failed to fetch patients", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Patient Records
        </h1>
        <Button
          label="Add Patient"
          icon="pi pi-plus"
          className="p-button-rounded p-button-success"
          onClick={() => router.push("/patients/add")}
        />
      </div>

      <Table
        title="Patients"
        data={patients}
        columns={columns}
        onEdit={handleEdit}
        onView={handleView}
      />
    </Layout>
  );
}
