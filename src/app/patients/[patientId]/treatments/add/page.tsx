"use client";
import Layout from "@/app/Components/Layout";
import TreatmentForm from "@/app/Components/TreatmentForm";
import { useParams } from "next/navigation";

export default function AddTreatmentPage() {
  const params = useParams();
  const patientId = params.patientId as string;

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Add Treatment
      </h1>
      <TreatmentForm patientId={patientId} />
    </Layout>
  );
}
