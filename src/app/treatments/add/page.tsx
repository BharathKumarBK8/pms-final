"use client";
import { useState, useEffect } from "react";
import Layout from "@/app/Components/Layout";
import TreatmentForm from "@/app/Components/TreatmentForm";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export default function AddTreatmentPage() {
  const [step, setStep] = useState(1);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then((data) => {
        const patientOptions = data.map((patient: any) => ({
          label: `${patient.name} (ID: ${patient.id})`,
          value: patient.id,
        }));
        setPatients(patientOptions);
      })
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  const handleNext = () => {
    if (selectedPatientId) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Add Treatment
      </h1>

      {step === 1 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Step 1: Select Patient</h2>
          <div className="grid gap-4">
            <div>
              <label className="block mb-2">Patient</label>
              <Dropdown
                value={selectedPatientId}
                options={patients}
                onChange={(e) => setSelectedPatientId(e.value)}
                placeholder="Select a patient"
                filter
                className="w-full"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                onClick={handleNext}
                disabled={!selectedPatientId}
              />
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              icon="pi pi-arrow-left"
              label="Back"
              severity="secondary"
              onClick={handleBack}
            />
            <span className="text-sm text-gray-600">
              Step 2: Treatment Details
            </span>
          </div>
          <TreatmentForm patientId={selectedPatientId!.toString()} />
        </div>
      )}
    </Layout>
  );
}
