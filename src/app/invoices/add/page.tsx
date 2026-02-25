"use client";
import InvoiceForm, { InvoiceFormRef } from "@/app/Components/InvoiceForm";
import Layout from "@/app/Components/Layout";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";

export default function AddInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billingId = searchParams.get("billingId") || "";
  const formRef = useRef<InvoiceFormRef>(null);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add Invoice</h1>
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
      <InvoiceForm
        ref={formRef}
        mode="add"
        billingId={billingId}
        onSave={() => router.back()}
        onCancel={() => router.back()}
      />
    </Layout>
  );
}
