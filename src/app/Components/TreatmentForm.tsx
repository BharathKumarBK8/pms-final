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
    performedBy: "",
    cost: "",
    status: "Planned",
  });

  const statusOptions = [
    { label: "Planned", value: "Planned" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const performedByOptions = [
    { label: "Dr. Smith", value: "Dr. Smith" },
    { label: "Dr. Johnson", value: "Dr. Johnson" },
    { label: "Dr. Lee", value: "Dr. Lee" },
  ];

  const isReadOnly = mode === "view";

  useEffect(() => {
    if (treatmentId) {
      const url = casesheetId
        ? `http://localhost:5000/api/patients/${patientId}/casesheets/${casesheetId}/treatments/${treatmentId}`
        : `http://localhost:5000/api/treatments/${treatmentId}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => setFormData({ ...data, date: new Date(data.date) }))
        .catch((err) => console.error("Error fetching treatment:", err));
    }
  }, [treatmentId, patientId, casesheetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let url;
      if (casesheetId) {
        url = treatmentId
          ? `http://localhost:5000/api/patients/${patientId}/casesheets/${casesheetId}/treatments/${treatmentId}`
          : `http://localhost:5000/api/patients/${patientId}/casesheets/${casesheetId}/treatments`;
      } else {
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
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h2
          className="section-title"
          style={{ marginBottom: "2rem", borderBottom: "none" }}
        >
          {mode === "add"
            ? "New Treatment"
            : mode === "edit"
            ? "Edit Treatment"
            : "Treatment Details"}
        </h2>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Date</label>
            <Calendar
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.value || null })
              }
              required
              disabled={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Treatment Name</label>
            <InputText
              value={formData.treatmentName}
              onChange={(e) =>
                setFormData({ ...formData, treatmentName: e.target.value })
              }
              disabled={isReadOnly}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Tooth Number</label>
            <InputText
              value={formData.toothNumber}
              onChange={(e) =>
                setFormData({ ...formData, toothNumber: e.target.value })
              }
              disabled={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Performed By</label>
            <Dropdown
              value={formData.performedBy}
              options={performedByOptions}
              onChange={(e) =>
                setFormData({ ...formData, performedBy: e.target.value })
              }
              disabled={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Cost</label>
            <InputText
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              required
              disabled={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Status</label>
            <Dropdown
              value={formData.status}
              options={statusOptions}
              onChange={(e) => setFormData({ ...formData, status: e.value })}
              disabled={isReadOnly}
            />
          </div>

          {mode !== "view" && (
            <div className="form-actions">
              <Button
                className="btn-primary"
                type="submit"
                label={treatmentId ? "Update" : "Save"}
                icon="pi pi-check"
              />
              <Button
                type="button"
                className="btn-secondary"
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
