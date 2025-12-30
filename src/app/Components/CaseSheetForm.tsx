"use client";
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useAppRouter } from "../context/RouterContext";
import Table from "./Table";

interface CasesheetFormProps {
  patientId: string;
  casesheetId?: string;
}

export default function CasesheetForm({
  patientId,
  casesheetId,
}: CasesheetFormProps) {
  const { navigateToPatientsList, navigateToAddTreatmentviaCasesheet } =
    useAppRouter();

  const [formData, setFormData] = useState({
    date: new Date() as Date | null,
    chiefComplaint: "",
    onDiagnosis: "",
    treatmentPlan: "",
    treatmentDone: "",
    treatmentPending: "",
    medicalHistory: "",
    payment: "",
  });
  const [treatments, setTreatments] = useState<any[]>([]);

  const treatmentColumns = [
    { field: "id", header: "Treatment ID", sortable: true },
    { field: "date", header: "Date", sortable: true },
    { field: "treatmentName", header: "Treatment", sortable: true },
    { field: "toothNumber", header: "Tooth Number", sortable: true },
    { field: "cost", header: "Cost", sortable: true },
    { field: "status", header: "Status", sortable: true },
  ];

  useEffect(() => {
    if (!casesheetId) return;

    const fetchData = async () => {
      try {
        const [casesheetRes, treatmentsRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/patients/${patientId}/casesheets/${casesheetId}`
          ),
          fetch(
            `http://localhost:5000/api/patients/${patientId}/casesheets/${casesheetId}/treatments`
          ),
        ]);

        const casesheetData = await casesheetRes.json();
        const treatmentsData = await treatmentsRes.json();

        setFormData({ ...casesheetData, date: new Date(casesheetData.date) });
        setTreatments(treatmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [patientId, casesheetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = casesheetId
        ? `http://localhost:5000/api/patients/${patientId}/casesheets/${casesheetId}`
        : `http://localhost:5000/api/patients/${patientId}/casesheets`;

      const method = casesheetId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigateToPatientsList();
      }
    } catch (error) {
      console.error(
        `Error ${casesheetId ? "updating" : "adding"} casesheet:`,
        error
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          {casesheetId ? "Edit Casesheet" : "New Casesheet"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block mb-2">Date</label>
            <Calendar
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.value as Date | null })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Chief Complaint</label>
            <InputTextarea
              value={formData.chiefComplaint}
              onChange={(e) =>
                setFormData({ ...formData, chiefComplaint: e.target.value })
              }
              required
              className="w-full"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">On Diagnosis</label>
            <InputTextarea
              value={formData.onDiagnosis}
              onChange={(e) =>
                setFormData({ ...formData, onDiagnosis: e.target.value })
              }
              className="w-full"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">Treatment Plan</label>
            <InputTextarea
              value={formData.treatmentPlan}
              onChange={(e) =>
                setFormData({ ...formData, treatmentPlan: e.target.value })
              }
              className="w-full"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">Treatment Done</label>
            <InputTextarea
              value={formData.treatmentDone}
              onChange={(e) =>
                setFormData({ ...formData, treatmentDone: e.target.value })
              }
              className="w-full"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">Treatment Pending</label>
            <InputTextarea
              value={formData.treatmentPending}
              onChange={(e) =>
                setFormData({ ...formData, treatmentPending: e.target.value })
              }
              className="w-full"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">Medical History</label>
            <InputTextarea
              value={formData.medicalHistory}
              onChange={(e) =>
                setFormData({ ...formData, medicalHistory: e.target.value })
              }
              className="w-full"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">Payment</label>
            <InputText
              value={formData.payment}
              onChange={(e) =>
                setFormData({ ...formData, payment: e.target.value })
              }
              className="w-full"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              label={casesheetId ? "Update" : "Save"}
              icon="pi pi-check"
            />
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              onClick={() => navigateToPatientsList()}
            />
          </div>
        </form>
      </div>
      {/* Treatments Table */}
      {casesheetId && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Treatment History</h3>
            <Button
              label="Add Treatment"
              icon="pi pi-plus"
              onClick={() =>
                navigateToAddTreatmentviaCasesheet(patientId, casesheetId)
              }
            />
          </div>

          <Table
            title={`CaseSheet ID: ${casesheetId}`}
            data={treatments}
            columns={treatmentColumns}
          />
        </div>
      )}
    </div>
  );
}
