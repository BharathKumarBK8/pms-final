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

  const handleSave = async (savedTreatment: any, autoNavigate: boolean) => {
    // Navigate based on autoNavigate flag
    if (autoNavigate) {
      router.push(`/billings/add?treatmentId=${savedTreatment.id}`); // Navigate to billing creation
    } else {
      router.back(); // Just go back to the previous page
    }
  };

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
        onSave={handleSave} // Pass the save handler to the form
        onCancel={() => router.back()}
      />
    </Layout>
  );
}
