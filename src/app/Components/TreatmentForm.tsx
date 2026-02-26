"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import Table from "./Table";
import { Treatment } from "../model";

interface TreatmentFormProps {
  patientId: string;
  casesheetId?: string;
  treatmentId?: string;
  mode: "view" | "edit" | "add";
  onSave?: (savedTreatment: Treatment, autoNavigate: boolean) => void; // <-- Modified to pass saved treatment
  onCancel?: () => void;
}

export interface TreatmentFormRef {
  submitForm: () => Promise<Treatment | undefined>; // <-- Returns saved treatment for automation
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
    const [billings, setBillings] = useState<any[]>([]);

    const [autoNavigate, setAutoNavigate] = useState(false); // State for auto-navigation after save
    const billingsColumns = [
      { field: "code", header: "Billing Code", sortable: true },
      { field: "totalCost", header: "Total Cost", sortable: true },
      { field: "discountAmount", header: "Discount Amount", sortable: true },
      { field: "finalAmount", header: "Final Amount", sortable: true },
      { field: "status", header: "Payment Status", sortable: true }, // <-- shows partial/full payment
    ];
    const isReadOnly = mode === "view";

    useEffect(() => {
      if (!treatmentId) return;

      const fetchData = async () => {
        try {
          const [treatmentRes, billingsRes] = await Promise.all([
            fetch(`http://localhost:5000/api/treatments/${treatmentId}`),
            fetch(
              `http://localhost:5000/api/billings?treatmentId=${treatmentId}`,
            ),
          ]);
          const treatmentData = await treatmentRes.json();
          const billingsData = await billingsRes.json();
          setFormData({ ...treatmentData, date: new Date(treatmentData.date) });
          setBillings(billingsData);
        } catch (error) {
          console.error("Error fetching treatment or billings:", error);
        }
      };

      fetchData();
    }, [treatmentId, casesheetId]);

    // --- MODIFIED handleSubmit for automation ---
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

        if (response.ok) {
          const savedTreatment: Treatment = await response.json();

          // Automatically set autoNavigate to true if the status is 'Completed'
          if (savedTreatment.status === "Completed") {
            if (onSave) onSave(savedTreatment, true); // Pass true to autoNavigate
            return savedTreatment;
          } else {
            // Just save without navigating
            if (onSave) onSave(savedTreatment, false); // Pass false to prevent navigation
            return savedTreatment;
          }
        }
      } catch (error) {
        console.error(
          `Error ${treatmentId ? "updating" : "adding"} treatment:`,
          error,
        );
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit, // <-- now returns savedTreatment
    }));

    return (
      <div className="form-container">
        <div className="form-card">
          <h2
            className="section-title"
            style={{
              marginBottom: "2rem",
              borderBottom: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {mode === "add"
                ? "New Treatment"
                : mode === "edit"
                  ? "Edit Treatment"
                  : "Treatment Details"}
            </span>
          </h2>
          {mode !== "view" && (
            <p className="text-sm text-gray-600 mb-4">
              When this treatment is marked Completed, it is added to the
              patient's visit invoice for the day.
            </p>
          )}
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
        {treatmentId && (
          <div className="form-card">
            <div className="section-header">
              <h3 className="section-title">Billings</h3>
            </div>
            <Table
              title={`Billings for Treatment`}
              data={billings}
              columns={billingsColumns}
              mode={mode}
            />
          </div>
        )}
      </div>
    );
  },
);

TreatmentForm.displayName = "TreatmentForm";

export default TreatmentForm;
