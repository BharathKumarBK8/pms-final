"use client";
import TreatmentForm, {
  TreatmentFormRef,
} from "@/app/Components/TreatmentForm";
import Layout from "@/app/Components/Layout";
import { useSearchParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";

export default function AddTreatmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") || "";
  const casesheetId = searchParams.get("casesheetId") || "";
  const formRef = useRef<TreatmentFormRef>(null);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add Treatment</h1>
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
      <TreatmentForm
        ref={formRef}
        patientId={patientId}
        casesheetId={casesheetId}
        mode="add"
        onSave={() => router.back()}
        onCancel={() => router.back()}
      />
    </Layout>
  );
}
