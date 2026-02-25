"use client";
import BillingForm, { BillingFormRef } from "@/app/Components/BillingForm";
import Layout from "@/app/Components/Layout";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";

export default function AddBillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const treatmentId = searchParams.get("treatmentId") || "";
  const formRef = useRef<BillingFormRef>(null);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add Billing</h1>
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
      <BillingForm
        ref={formRef}
        mode="add"
        treatmentId={treatmentId}
        onSave={() => router.back()}
        onCancel={() => router.back()}
      />
    </Layout>
  );
}
