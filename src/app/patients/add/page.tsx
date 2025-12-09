"use client";
import Layout from "../../Components/Layout";
import PatientForm from "../../Components/PatientForm";

export default function AddPatientPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Add Patient</h1>
      <PatientForm />
    </Layout>
  );
}
