"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

interface TreatmentFormProps {
  patientId: string;
  casesheetId?: string;
  treatmentId?: string;
  mode: "view" | "edit" | "add";
  onSave?: () => void;
  onCancel?: () => void;
}

export interface TreatmentFormRef {
  submitForm: () => void;
}

const TreatmentForm = forwardRef<TreatmentFormRef, TreatmentFormProps>(
  ({ patientId, casesheetId, treatmentId, mode, onSave, onCancel }, ref) => {
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
        fetch(`http://localhost:5000/api/treatments/${treatmentId}`)
          .then((res) => res.json())
          .then((data) => setFormData({ ...data, date: new Date(data.date) }))
          .catch((err) => console.error("Error fetching treatment:", err));
      }
    }, [treatmentId]);

    const handleSubmit = async () => {
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

        if (response.ok && onSave) {
          onSave();
        }
      } catch (error) {
        console.error(
          `Error ${treatmentId ? "updating" : "adding"} treatment:`,
          error
        );
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    return (
      <div className="form-container">
        <div className="form-card">
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
          </div>
        </div>
      </div>
    );
  }
);

TreatmentForm.displayName = "TreatmentForm";

export default TreatmentForm;
