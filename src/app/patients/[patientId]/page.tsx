"use client";
import Layout from "@/app/Components/Layout";
import PatientForm from "@/app/Components/PatientForm";
import { useParams } from "next/navigation";

export default function EditPatientPage() {
  const params = useParams();
  const patientId = params.patientId as string;

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        View Patient
      </h1>
      <PatientForm patientId={patientId} mode="view" />
    </Layout>
  );
}
