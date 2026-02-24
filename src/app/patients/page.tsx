"use client";
import { useEffect, useState } from "react";
import Table from "../Components/Table";
import Layout from "../Components/Layout";
import { Button } from "primereact/button";
import { useAppRouter } from "../context/RouterContext";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../Components/ProtectedRoute";

export default function PatientsPage() {
  const { navigateToPatientEdit, navigateToPatientView, navigateToPatientAdd } =
    useAppRouter();

  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { field: "id", header: "Patient ID", sortable: true },
    { field: "name", header: "Name", sortable: true },
    { field: "age", header: "Age", sortable: true },
    { field: "gender", header: "Gender", sortable: true },
    { field: "status", header: "Status", sortable: true },
  ];

  const handleEdit = (rowData: any) => {
    navigateToPatientEdit(rowData.id);
  };

  const handleView = (rowData: any) => {
    navigateToPatientView(rowData.id);
  };

  const handleDelete = (rowData: any) => {
    console.log("Delete patient with ID:", rowData.id);
  };

  useEffect(() => {
    if (!user) return;

    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/patients");
        const json = await res.json();
        setPatients(json);
      } catch (error) {
        console.error("Failed to fetch patients", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Patient Records
          </h1>
          <Button
            label="Add Patient"
            icon="pi pi-plus"
            className="btn-primary"
            onClick={() => navigateToPatientAdd()}
          />
        </div>

        <Table
          title="Patients"
          data={patients}
          columns={columns}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      </Layout>
    </ProtectedRoute>
  );
}
