"use client";
import Layout from "../../../Components/Layout";
import PatientForm from "../../../Components/PatientForm";
import { useParams } from "next/navigation";

export default function EditPatientPage() {
  const params = useParams();
  const patientId = params.patientId as string;

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Edit Patient
      </h1>
      <PatientForm patientId={patientId} mode="edit" />
    </Layout>
  );
}
