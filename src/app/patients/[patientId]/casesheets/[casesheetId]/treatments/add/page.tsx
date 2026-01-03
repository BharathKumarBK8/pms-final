"use client";
import TreatmentForm, {
  TreatmentFormRef,
} from "@/app/Components/TreatmentForm";
import Layout from "@/app/Components/Layout";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";

export default function AddTreatmentPage() {
  const params = useParams();
  const router = useRouter();
  const formRef = useRef<TreatmentFormRef>(null);
  const patientId = params.patientId as string;
  const casesheetId = params.casesheetId as string;

  const handleSave = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
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
            onClick={handleCancel}
          />
        </div>
      </div>
      <TreatmentForm
        ref={formRef}
        patientId={patientId}
        casesheetId={casesheetId}
        mode="add"
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Layout>
  );
}
