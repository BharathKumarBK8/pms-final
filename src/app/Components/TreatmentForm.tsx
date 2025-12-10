"use client";
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import Table from "./Table";

interface TreatmentFormProps {
  patientId: string;
  treatmentId?: string;
}

export default function TreatmentForm({
  patientId,
  treatmentId,
}: TreatmentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: patientId,
    date: new Date() as Date | null,
    treatmentName: "",
    toothNumber: "",
    cost: "",
    status: "Planned",
  });

  const statusOptions = [
    { label: "Planned", value: "Planned" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const billingColumns = [
    { field: "id", header: "Billing ID", sortable: true },
    { field: "serviceDescription", header: "Service", sortable: true },
    { field: "amount", header: "Amount", sortable: true },
    { field: "date", header: "Date", sortable: true },
  ];

  const invoiceColumns = [
    { field: "id", header: "Invoice ID", sortable: true },
    { field: "amount", header: "Amount", sortable: true },
    { field: "date", header: "Date", sortable: true },
    { field: "paymentMethod", header: "Payment Method" },
    { field: "status", header: "Payment Status", sortable: true },
  ];

  useEffect(() => {
    if (treatmentId) {
      fetch(`http://localhost:5000/api/treatments/${treatmentId}`)
        .then((res) => res.json())
        .then((data) => setFormData({ ...data, date: new Date(data.date) }))
        .catch((err) => console.error("Error fetching treatment:", err));
    }
  }, [treatmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = treatmentId
        ? `http://localhost:5000/api/treatments/${treatmentId}`
        : "http://localhost:5000/api/treatments";
      const method = treatmentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push(`/patients/edit/${patientId}`);
      }
    } catch (error) {
      console.error(
        `Error ${treatmentId ? "updating" : "adding"} treatment:`,
        error
      );
    }
  };

  const handleEditBilling = (rowData: any) => {
    router.push(`/billing/edit/${rowData.id}`);
  };

  const handleViewInvoice = (rowData: any) => {
    router.push(`/invoices/view/${rowData.id}`);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="grid gap-4">
          <div>
            <label className="block mb-2">Date</label>
            <Calendar
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.value || null })
              }
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Treatment Name</label>
            <InputText
              value={formData.treatmentName}
              onChange={(e) =>
                setFormData({ ...formData, treatmentName: e.target.value })
              }
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Tooth Number</label>
            <InputText
              value={formData.toothNumber}
              onChange={(e) =>
                setFormData({ ...formData, toothNumber: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Cost</label>
            <InputText
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
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
              label={treatmentId ? "Update" : "Save"}
              icon="pi pi-check"
            />
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              onClick={() => router.push(`/patients/edit/${patientId}`)}
            />
          </div>
        </div>
      </form>

      {treatmentId && (
        <>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Billing Summary</h3>
            <Table
              endpoint={`http://localhost:5000/api/billing?treatmentId=${treatmentId}`}
              columns={billingColumns}
              onEdit={handleEditBilling}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Invoices & Payments</h3>
            <Table
              endpoint={`http://localhost:5000/api/invoices?treatmentId=${treatmentId}`}
              columns={invoiceColumns}
              onEdit={handleViewInvoice}
            />
          </div>
        </>
      )}
    </div>
  );
}
