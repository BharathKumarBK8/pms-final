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
  mode: "view" | "edit" | "add";
}

export default function CasesheetForm({
  patientId,
  casesheetId,
  mode,
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

  const isReadOnly = mode === "view";

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
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h2
          className="section-title"
          style={{ marginBottom: "2rem", borderBottom: "none" }}
        >
          {mode === "add"
            ? "New Casesheet"
            : mode === "edit"
            ? "Edit Casesheet"
            : "Casesheet Details"}
        </h2>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Date</label>
            <Calendar
              disabled={isReadOnly}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.value as Date | null })
              }
            />
          </div>

          <div className="form-field">
            <label className="form-label">Chief Complaint</label>
            <InputTextarea
              value={formData.chiefComplaint}
              onChange={(e) =>
                setFormData({ ...formData, chiefComplaint: e.target.value })
              }
              required
              disabled={isReadOnly}
              rows={3}
            />
          </div>

          <div className="form-field">
            <label className="form-label">On Diagnosis</label>
            <InputTextarea
              value={formData.onDiagnosis}
              onChange={(e) =>
                setFormData({ ...formData, onDiagnosis: e.target.value })
              }
              rows={3}
              disabled={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Treatment Plan</label>
            <InputTextarea
              value={formData.treatmentPlan}
              onChange={(e) =>
                setFormData({ ...formData, treatmentPlan: e.target.value })
              }
              rows={3}
              disabled={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Treatment Done</label>
            <InputTextarea
              value={formData.treatmentDone}
              onChange={(e) =>
                setFormData({ ...formData, treatmentDone: e.target.value })
              }
              rows={3}
              disabled={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Treatment Pending</label>
            <InputTextarea
              value={formData.treatmentPending}
              onChange={(e) =>
                setFormData({ ...formData, treatmentPending: e.target.value })
              }
              rows={3}
              disabled={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Medical History</label>
            <InputTextarea
              value={formData.medicalHistory}
              onChange={(e) =>
                setFormData({ ...formData, medicalHistory: e.target.value })
              }
              rows={3}
              disabled={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Payment</label>
            <InputText
              value={formData.payment}
              onChange={(e) =>
                setFormData({ ...formData, payment: e.target.value })
              }
              disabled={isReadOnly}
            />
          </div>

          {mode !== "view" && (
            <div className="form-actions">
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
          )}
        </div>
      </form>

      {casesheetId && (
        <div className="form-card">
          <div className="section-header">
            <h3 className="section-title">Treatment History</h3>
            {mode !== "view" && (
              <Button
                label="Add Treatment"
                className="btn-primary"
                icon="pi pi-plus"
                onClick={() =>
                  navigateToAddTreatmentviaCasesheet(patientId, casesheetId)
                }
              />
            )}
          </div>

          <Table
            title={`CaseSheet ID: ${casesheetId}`}
            data={treatments}
            columns={treatmentColumns}
            mode={mode}
          />
        </div>
      )}
    </div>
  );
}
