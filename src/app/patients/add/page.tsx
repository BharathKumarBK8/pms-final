"use client";
import PatientForm, { PatientFormRef } from "@/app/Components/PatientForm";
import Layout from "@/app/Components/Layout";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";
import { useAppRouter } from "@/app/context/RouterContext";
import { Patient } from "@/app/model";

export default function AddPatientPage() {
  const router = useRouter();
  const formRef = useRef<PatientFormRef>(null);
  const { navigateToCasesheetAdd } = useAppRouter();

  const handleSave = async (patientData: Patient, autoNavigate: boolean) => {
    // Navigate based on autoNavigate flag
    if (autoNavigate) {
      navigateToCasesheetAdd(patientData.id); // Navigate to casesheet creation
    } else {
      router.back(); // Just go back to the previous page
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add Patient</h1>
        <div className="flex gap-2">
          <Button
            label="Save"
            icon="pi pi-check"
            className="btn-secondary"
            onClick={() => formRef.current?.submitForm()} // Trigger form submission
          />
          <Button
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            className="btn-secondary"
            onClick={() => router.back()}
          />
        </div>
      </div>
      <PatientForm
        ref={formRef}
        mode="add"
        onSave={handleSave} // Pass the save handler to the form
        onCancel={() => router.back()}
      />
    </Layout>
  );
}
