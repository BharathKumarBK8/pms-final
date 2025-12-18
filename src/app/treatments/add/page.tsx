"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/Components/Layout";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

interface PatientOption {
  label: string;
  value: number;
}

export default function AddTreatmentPage() {
  const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(
    null
  );
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientOption[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then((data) => {
        const patientOptions: PatientOption[] = data.map((patient: any) => ({
          label: `${patient.name} (ID: ${patient.id})`,
          value: patient.id,
        }));
        setPatients(patientOptions);
      })
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  const searchPatients = (event: { query: string }) => {
    const query = event.query.toLowerCase();

    setFilteredPatients(
      patients.filter(
        (p) =>
          p.label.toLowerCase().includes(query) ||
          p.value.toString().includes(query)
      )
    );
  };

  const handleNext = () => {
    if (selectedPatient) {
      router.push(`/patients/${selectedPatient.value}/treatments/add`);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Add Treatment
      </h1>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Select Patient</h2>

        <div className="grid gap-4">
          <div>
            <label className="block mb-2">Patient</label>
            <AutoComplete
              value={selectedPatient}
              suggestions={filteredPatients}
              completeMethod={searchPatients}
              field="label"
              placeholder="Type patient name or ID"
              onChange={(e) => setSelectedPatient(e.value)}
              dropdown
              className="w-full"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              onClick={handleNext}
              disabled={!selectedPatient}
            />
          </div>
        </div>
      </Card>
    </Layout>
  );
}
