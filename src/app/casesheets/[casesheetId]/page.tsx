"use client";
import CasesheetForm, {
  CasesheetFormRef,
} from "@/app/Components/CaseSheetForm";
import Layout from "@/app/Components/Layout";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";

export default function ViewCasesheetPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<CasesheetFormRef>(null);
  const casesheetId = params.casesheetId as string;
  const patientId = searchParams.get("patientId") || "";

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">View Casesheet</h1>
        <div className="flex gap-2">
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            className="btn-secondary"
            onClick={() => router.back()}
          />
        </div>
      </div>
      <CasesheetForm
        ref={formRef}
        patientId={patientId}
        casesheetId={casesheetId}
        mode="view"
      />
    </Layout>
  );
}
