"use client";
import Layout from "@/app/Components/Layout";
import PatientForm, { PatientFormRef } from "@/app/Components/PatientForm";
import { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "primereact/button";

export default function ViewPatientPage() {
  const params = useParams();
  const router = useRouter();
  const formRef = useRef<PatientFormRef>(null);
  const patientId = params.patientId as string;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">View Patient</h1>
        <div className="flex gap-2">
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            severity="secondary"
            className="btn-secondary"
            onClick={() => router.back()}
          />
        </div>
      </div>
      <PatientForm
        ref={formRef}
        patientId={patientId}
        mode="view"
        onCancel={() => router.back()}
      />
    </Layout>
  );
}
