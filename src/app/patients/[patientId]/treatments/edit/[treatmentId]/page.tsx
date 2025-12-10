"use client";
import Layout from "../../../../../Components/Layout";
import TreatmentForm from "../../../../../Components/TreatmentForm";
import { useParams } from "next/navigation";

export default function EditTreatmentPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const treatmentId = params.treatmentId as string;

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Edit Treatment
      </h1>
      <TreatmentForm patientId={patientId} treatmentId={treatmentId} />
    </Layout>
  );
}
