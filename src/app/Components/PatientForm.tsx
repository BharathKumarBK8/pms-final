"use client";
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import Table from "./Table";

interface PatientFormProps {
  patientId?: string;
}

export default function PatientForm({ patientId }: PatientFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    status: "Active",
  });

  const [treatments, setTreatments] = useState<any[]>([]);

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const treatmentColumns = [
    { field: "id", header: "Treatment ID", sortable: true },
    { field: "date", header: "Date", sortable: true },
    { field: "treatmentName", header: "Treatment", sortable: true },
    { field: "toothNumber", header: "Tooth Number", sortable: true },
    { field: "cost", header: "Cost", sortable: true },
    { field: "status", header: "Status", sortable: true },
  ];

  useEffect(() => {
    if (!patientId) return;

    const fetchPatientAndTreatments = async () => {
      try {
        const [patientRes, treatmentsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/patients/${patientId}`),
          fetch(`http://localhost:5000/api/patients/${patientId}/treatments`),
        ]);

        const patientData = await patientRes.json();
        const treatmentsData = await treatmentsRes.json();

        setFormData(patientData);
        setTreatments(treatmentsData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientAndTreatments();
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = patientId
        ? `http://localhost:5000/api/patients/${patientId}`
        : "http://localhost:5000/api/patients";

      const method = patientId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/patients");
      }
    } catch (error) {
      console.error(
        `Error ${patientId ? "updating" : "adding"} patient:`,
        error
      );
    }
  };

  const handleEditTreatment = (rowData: any) => {
    router.push(`/patients/${patientId}/treatments/edit/${rowData.id}`);
  };

  const handleViewTreatment = (rowData: any) => {
    router.push(`/patients/${patientId}/treatments/view/${rowData.id}`);
  };

  const handleAddTreatment = () => {
    router.push(`/patients/${patientId}/treatments/add`);
  };

  return (
    <div className="space-y-6">
      {/* Patient Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="grid gap-4">
          <div>
            <label className="block mb-2">Name</label>
            <InputText
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">Age</label>
            <InputText
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">Gender</label>
            <Dropdown
              value={formData.gender}
              options={genderOptions}
              onChange={(e) => setFormData({ ...formData, gender: e.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">Phone</label>
            <InputText
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">Status</label>
            <Dropdown
              value={formData.status}
              options={statusOptions}
              onChange={(e) => setFormData({ ...formData, status: e.value })}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              label={patientId ? "Update" : "Save"}
              icon="pi pi-check"
            />
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              onClick={() => router.push("/patients")}
            />
          </div>
        </div>
      </form>

      {/* Treatments Table */}
      {patientId && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Treatment History</h3>
            <Button
              label="Add Treatment"
              icon="pi pi-plus"
              onClick={handleAddTreatment}
            />
          </div>

          <Table
            title={`Patient ID: ${patientId}`}
            data={treatments}
            columns={treatmentColumns}
            onEdit={handleEditTreatment}
            onView={handleViewTreatment}
          />
        </div>
      )}
    </div>
  );
}
