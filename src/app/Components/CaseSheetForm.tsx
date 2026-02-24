"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useAppRouter } from "../context/RouterContext";
import Table from "./Table";
import MediaSection from "./MediaSection";

interface CasesheetFormProps {
  patientId: string;
  casesheetId?: string;
  mode: "view" | "edit" | "add";
  onSave?: () => void;
  onCancel?: () => void;
}

export interface CasesheetFormRef {
  submitForm: () => void;
}

const CasesheetForm = forwardRef<CasesheetFormRef, CasesheetFormProps>(
  ({ patientId, casesheetId, mode, onSave, onCancel }, ref) => {
    const {
      navigateToAddTreatmentviaCasesheet,
      navigateToEditTreatmentviaCasesheet,
      navigateToViewTreatmentviaCasesheet,
    } = useAppRouter();

    const [formData, setFormData] = useState({
      date: new Date() as Date | null,
      chiefComplaint: "",
      onDiagnosis: "",
      treatmentPlan: "",
      treatmentPending: "",
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
            fetch(`http://localhost:5000/api/casesheets/${casesheetId}`),
            fetch(
              `http://localhost:5000/api/treatments?patientId=${patientId}&casesheetId=${casesheetId}`
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

    const handleViewTreatment = (treatment: any) => {
      navigateToViewTreatmentviaCasesheet(
        patientId,
        casesheetId!,
        treatment.id
      );
    };

    const handleEditTreatment = (treatment: any) => {
      navigateToEditTreatmentviaCasesheet(
        patientId,
        casesheetId!,
        treatment.id
      );
    };

    const handleSubmit = async () => {
      try {
        const url = casesheetId
          ? `http://localhost:5000/api/casesheets/${casesheetId}`
          : `http://localhost:5000/api/casesheets`;

        const method = casesheetId ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, patientId: parseInt(patientId) }),
        });

        if (response.ok && onSave) {
          onSave();
        }
      } catch (error) {
        console.error(
          `Error ${casesheetId ? "updating" : "adding"} casesheet:`,
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
          </div>
        </div>

        {casesheetId && mode !== "add" && (
          <div className="form-card">
            <h2 className="section-title">Casesheet Media</h2>
            <MediaSection
              patientId={patientId}
              casesheetId={casesheetId}
              title=""
            />
          </div>
        )}

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
              onView={handleViewTreatment}
              onEdit={handleEditTreatment}
            />
          </div>
        )}
      </div>
    );
  }
);

CasesheetForm.displayName = "CasesheetForm";

export default CasesheetForm;
