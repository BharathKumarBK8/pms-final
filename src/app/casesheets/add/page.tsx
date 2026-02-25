"use client";
import CasesheetForm, {
  CasesheetFormRef,
} from "@/app/Components/CaseSheetForm";
import Layout from "@/app/Components/Layout";
import { useSearchParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";

export default function AddCasesheetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") || "";
  const formRef = useRef<CasesheetFormRef>(null);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add Casesheet</h1>
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
      <CasesheetForm
        ref={formRef}
        patientId={patientId}
        mode="add"
        onSave={() => router.back()}
        onCancel={() => router.back()}
      />
    </Layout>
  );
}
