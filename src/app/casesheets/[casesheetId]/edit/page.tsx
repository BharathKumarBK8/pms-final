"use client";
import CasesheetForm, {
  CasesheetFormRef,
} from "@/app/Components/CaseSheetForm";
import Layout from "@/app/Components/Layout";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";

const EditCaseSheet = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<CasesheetFormRef>(null);
  const casesheetId = params.casesheetId as string;
  const patientId = searchParams.get("patientId") || "";

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Casesheet</h1>
        <div className="flex gap-2">
          <Button
            label="Update"
            icon="pi pi-check"
            className="btn-secondary"
            onClick={() => formRef.current?.submitForm()}
          />
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            severity="secondary"
            className="btn-secondary"
            onClick={() => router.back()}
          />
        </div>
      </div>
      <CasesheetForm
        ref={formRef}
        patientId={patientId}
        casesheetId={casesheetId}
        mode="edit"
        onSave={() => router.back()}
        onCancel={() => router.back()}
      />
    </Layout>
  );
};

export default EditCaseSheet;
