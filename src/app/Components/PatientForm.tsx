"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useAppRouter } from "../context/RouterContext";
import Table from "./Table";

interface PatientFormProps {
  patientId?: string;
  mode: "view" | "edit" | "add";
  onSave?: () => void;
  onCancel?: () => void;
}

export interface PatientFormRef {
  submitForm: () => void;
}

const PatientForm = forwardRef<PatientFormRef, PatientFormProps>(
  ({ patientId, mode, onSave, onCancel }, ref) => {
    const {
      navigateToCasesheetEdit,
      navigateToCasesheetView,
      navigateToCasesheetAdd,
    } = useAppRouter();

    const [formData, setFormData] = useState({
      name: "",
      age: "",
      gender: "",
      phone: "",
      medicalConditions: "",
      status: "Active",
    });

    const isReadOnly = mode === "view";
    const [casesheets, setCasesheets] = useState<any[]>([]);

    const genderOptions = [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
    ];

    const statusOptions = [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ];

    const casesheetColumns = [
      { field: "id", header: "Casesheet ID", sortable: true },
      { field: "date", header: "Date", sortable: true },
      { field: "chiefComplaint", header: "Chief Complaint", sortable: true },
      { field: "onDiagnosis", header: "On Diagnosis", sortable: true },
    ];

    useEffect(() => {
      if (!patientId) return;

      const fetchPatientAndCasesheets = async () => {
        try {
          const [patientRes, casesheetsRes] = await Promise.all([
            fetch(`http://localhost:5000/api/patients/${patientId}`),
            fetch(
              `http://localhost:5000/api/casesheets?patientId=${patientId}`
            ),
          ]);

          const patientData = await patientRes.json();
          const casesheetsData = await casesheetsRes.json();
          setFormData(patientData);
          setCasesheets(casesheetsData);
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      };

      fetchPatientAndCasesheets();
    }, [patientId]);

    const handleSubmit = async () => {
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

        if (response.ok && onSave) {
          onSave();
        }
      } catch (error) {
        console.error(
          `Error ${patientId ? "updating" : "adding"} patient:`,
          error
        );
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    const handleEditCasesheet = (rowData: any) => {
      if (!patientId) return;
      navigateToCasesheetEdit(patientId, rowData.id);
    };

    const handleViewCasesheet = (rowData: any) => {
      if (!patientId) return;
      navigateToCasesheetView(patientId, rowData.id);
    };

    const handleAddCasesheet = () => {
      if (!patientId) return;
      navigateToCasesheetAdd(patientId);
    };

    return (
      <div className="form-container">
        <div className="form-card">
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Name</label>
              <InputText
                disabled={isReadOnly}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Age</label>
              <InputText
                disabled={isReadOnly}
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Gender</label>
              <Dropdown
                value={formData.gender}
                options={genderOptions}
                onChange={(e) => setFormData({ ...formData, gender: e.value })}
                disabled={isReadOnly}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Phone</label>
              <InputText
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                disabled={isReadOnly}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Previous Medical Conditions</label>
              <InputTextarea
                value={formData["medicalConditions"] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medicalConditions: e.target.value,
                  })
                }
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

        {patientId && (
          <div className="form-card">
            <div className="section-header">
              <h3 className="section-title">Casesheets</h3>
              {mode !== "view" && (
                <Button
                  label="Add Casesheet"
                  className="btn-primary"
                  icon="pi pi-plus"
                  onClick={handleAddCasesheet}
                />
              )}
            </div>
            <Table
              title={`Patient ID: ${patientId}`}
              data={casesheets}
              columns={casesheetColumns}
              onEdit={handleEditCasesheet}
              onView={handleViewCasesheet}
              mode={mode}
            />
          </div>
        )}
      </div>
    );
  }
);

PatientForm.displayName = "PatientForm";

export default PatientForm;
