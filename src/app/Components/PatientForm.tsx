"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
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
  ({ patientId, mode, onSave }, ref) => {
    const {
      navigateToCasesheetEdit,
      navigateToCasesheetView,
      navigateToCasesheetAdd,
    } = useAppRouter();

    // ✅ Form state (No age stored)
    const [formData, setFormData] = useState({
      name: "",
      dateOfBirth: null as Date | null,
      gender: "",
      phoneNumber: "",
      previousConditions: "",
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

    // ✅ Calculate age dynamically from DOB
    const calculateAge = (dob: Date) => {
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      return age;
    };

    const age = formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : "";

    // ✅ Format DOB as YYYY-MM-DD for backend
    const formatLocalDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // ✅ Fetch patient + casesheets
    useEffect(() => {
      if (!patientId) return;

      const fetchPatientAndCasesheets = async () => {
        try {
          const [patientRes, casesheetsRes] = await Promise.all([
            fetch(`http://localhost:5000/api/patients/${patientId}`),
            fetch(
              `http://localhost:5000/api/casesheets?patientId=${patientId}`,
            ),
          ]);

          const patientData = await patientRes.json();
          const casesheetsData = await casesheetsRes.json();

          setFormData({
            ...patientData,
            dateOfBirth: patientData.dateOfBirth
              ? new Date(patientData.dateOfBirth)
              : null,
          });

          setCasesheets(casesheetsData);
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      };

      fetchPatientAndCasesheets();
    }, [patientId]);

    // ✅ Submit handler (no age sent)
    const handleSubmit = async () => {
      try {
        const url = patientId
          ? `http://localhost:5000/api/patients/${patientId}`
          : "http://localhost:5000/api/patients";
        const method = patientId ? "PUT" : "POST";

        const payload = {
          name: formData.name,
          dateOfBirth: formData.dateOfBirth
            ? formatLocalDate(formData.dateOfBirth)
            : null,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          previousConditions: formData.previousConditions,
          status: formData.status,
        };

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok && onSave) onSave();
      } catch (error) {
        console.error("Error saving patient:", error);
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
            {/* Name */}
            <div className="form-field">
              <label>Name</label>
              <InputText
                value={formData.name}
                disabled={isReadOnly}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* DOB */}
            <div className="form-field">
              <label>Date of Birth</label>
              <Calendar
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.value as Date })
                }
                showIcon
                dateFormat="dd/mm/yy"
                maxDate={new Date()}
                disabled={isReadOnly}
                required
              />
            </div>

            {/* Age (derived) */}
            <div className="form-field">
              <label>Age</label>
              <InputText value={age.toString()} disabled />
            </div>

            {/* Gender */}
            <div className="form-field">
              <label>Gender</label>
              <Dropdown
                value={formData.gender}
                options={genderOptions}
                disabled={isReadOnly}
                onChange={(e) => setFormData({ ...formData, gender: e.value })}
                required
              />
            </div>

            {/* Phone */}
            <div className="form-field">
              <label>Phone</label>
              <InputText
                value={formData.phoneNumber}
                disabled={isReadOnly}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
            </div>

            {/* Previous Conditions */}
            <div className="form-field">
              <label>Previous Medical Conditions</label>
              <InputTextarea
                value={formData.previousConditions || ""}
                disabled={isReadOnly}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    previousConditions: e.target.value,
                  })
                }
              />
            </div>

            {/* Status */}
            <div className="form-field">
              <label>Status</label>
              <Dropdown
                value={formData.status}
                options={statusOptions}
                disabled={isReadOnly}
                onChange={(e) => setFormData({ ...formData, status: e.value })}
              />
            </div>
          </div>
        </div>

        {/* Casesheets Section */}
        {patientId && (
          <div className="form-card">
            <div className="section-header">
              <h3>Casesheets</h3>
              {mode !== "view" && (
                <Button
                  label="Add Casesheet"
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
  },
);

PatientForm.displayName = "PatientForm";
export default PatientForm;
