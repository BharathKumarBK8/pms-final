"use client";
import TreatmentForm from "@/app/Components/TreatmentForm";
import Layout from "@/app/Components/Layout";
import { useParams } from "next/navigation";

export default function AddTreatmentPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const casesheetId = params.casesheetId as string;
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Add Treatment</h1>
      <TreatmentForm
        patientId={patientId}
        casesheetId={casesheetId}
        mode="add"
      />
    </Layout>
  );
}
