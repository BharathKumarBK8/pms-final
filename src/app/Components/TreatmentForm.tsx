"use client";
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useAppRouter } from "../context/RouterContext";

interface TreatmentFormProps {
  patientId: string;
  casesheetId?: string;
  treatmentId?: string;
  mode: "view" | "edit" | "add";
}

export default function TreatmentForm({
  patientId,
  casesheetId,
  treatmentId,
  mode,
}: TreatmentFormProps) {
  const { navigateToPatientEdit, navigateToCasesheetEdit } = useAppRouter();
  const [formData, setFormData] = useState({
    patientId: patientId,
    casesheetId: casesheetId,
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

  const isReadOnly = mode === "view";

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
      let url;
      if (casesheetId) {
        // Use casesheet-specific endpoint
        url = treatmentId
          ? `http://localhost:5000/api/patients/${patientId}/casesheets/${casesheetId}/treatments/${treatmentId}`
          : `http://localhost:5000/api/patients/${patientId}/casesheets/${casesheetId}/treatments`;
      } else {
        // Use direct patient endpoint
        url = treatmentId
          ? `http://localhost:5000/api/treatments/${treatmentId}`
          : "http://localhost:5000/api/treatments";
      }

      const method = treatmentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (patientId && !casesheetId) navigateToPatientEdit(patientId);
        else if (patientId && casesheetId)
          navigateToCasesheetEdit(patientId, casesheetId);
      }
    } catch (error) {
      console.error(
        `Error ${treatmentId ? "updating" : "adding"} treatment:`,
        error
      );
    }
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
              disabled={isReadOnly}
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
              disabled={isReadOnly}
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
              disabled={isReadOnly}
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
              disabled={isReadOnly}
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
              disabled={isReadOnly}
            />
          </div>
          {mode !== "view" && (
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
                onClick={() => {
                  if (patientId && !casesheetId)
                    navigateToPatientEdit(patientId);
                  else if (patientId && casesheetId)
                    navigateToCasesheetEdit(patientId, casesheetId);
                }}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
