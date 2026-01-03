"use client";
import TreatmentForm, {
  TreatmentFormRef,
} from "@/app/Components/TreatmentForm";
import Layout from "@/app/Components/Layout";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";

export default function EditTreatmentPage() {
  const params = useParams();
  const router = useRouter();
  const formRef = useRef<TreatmentFormRef>(null);
  const patientId = params.patientId as string;
  const casesheetId = params.casesheetId as string;
  const treatmentId = params.treatmentId as string;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">View Treatment</h1>
        <div className="flex gap-2">
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
        treatmentId={treatmentId}
        mode="view"
        onSave={() => router.back()}
        onCancel={() => router.back()}
      />
    </Layout>
  );
}
