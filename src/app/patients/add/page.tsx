"use client";
import PatientForm, { PatientFormRef } from "@/app/Components/PatientForm";
import Layout from "@/app/Components/Layout";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";

export default function AddPatientPage() {
  const router = useRouter();
  const formRef = useRef<PatientFormRef>(null);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add Patient</h1>
        <div className="flex gap-2">
          <Button
            label="Save"
            icon="pi pi-check"
            className="btn-secondary"
            onClick={() => formRef.current?.submitForm()}
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
        onSave={() => router.back()}
        onCancel={() => router.back()}
      />
    </Layout>
  );
}
