"use client";
import PaymentForm, { PaymentFormRef } from "@/app/Components/PaymentForm";
import Layout from "@/app/Components/Layout";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Button } from "primereact/button";

export default function AddPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId") || "";
  const formRef = useRef<PaymentFormRef>(null);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add Payment</h1>
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
      <PaymentForm
        ref={formRef}
        mode="add"
        invoiceId={invoiceId}
        onSave={() => router.back()}
        onCancel={() => router.back()}
      />
    </Layout>
  );
}
