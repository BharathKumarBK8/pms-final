"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/Components/Layout";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

interface PatientOption {
  label: string;
  value: number;
}

interface CasesheetOption {
  label: string;
  value: number;
}

export default function AddTreatmentPage() {
  const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(
    null
  );
  const [selectedCasesheet, setSelectedCasesheet] =
    useState<CasesheetOption | null>(null);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [casesheets, setCasesheets] = useState<CasesheetOption[]>([]);
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

  useEffect(() => {
    if (selectedPatient) {
      setSelectedCasesheet(null);
      fetch(
        `http://localhost:5000/api/casesheets?patientId=${selectedPatient.value}`
      )
        .then((res) => res.json())
        .then((data) => {
          const casesheetOptions: CasesheetOption[] = data.map(
            (casesheet: any) => ({
              label: `${casesheet.chiefComplaint} - ${new Date(
                casesheet.date
              ).toLocaleDateString()}`,
              value: casesheet.id,
            })
          );
          setCasesheets(casesheetOptions);
        })
        .catch((err) => console.error("Error fetching casesheets:", err));
    } else {
      setCasesheets([]);
      setSelectedCasesheet(null);
    }
  }, [selectedPatient]);

  const searchPatients = (event: { query: string }) => {
    const query = event.query.toLowerCase();
    const filtered = patients.filter(
      (p) =>
        p.label.toLowerCase().includes(query) ||
        p.value.toString().includes(query)
    );

    if (filtered.length === 0 && query) {
      setFilteredPatients([{ label: "No records found", value: -1 }]);
    } else {
      setFilteredPatients(filtered);
    }
  };

  const handleNext = () => {
    console.log("selectedPatient:", selectedPatient);
    console.log("selectedCasesheet:", selectedCasesheet);
    if (selectedPatient && selectedCasesheet) {
      router.push(
        `/patients/${selectedPatient.value}/casesheets/${selectedCasesheet}/treatments/add`
      );
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Add Treatment
      </h1>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Select Patient & Casesheet
        </h2>

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

          {selectedPatient && (
            <div>
              <label className="block mb-2">Casesheet</label>
              <Dropdown
                value={selectedCasesheet}
                options={casesheets}
                onChange={(e) => setSelectedCasesheet(e.value)}
                optionLabel="label"
                optionValue="value"
                placeholder="Select a casesheet"
                className="w-full"
                disabled={casesheets.length === 0}
              />
              {casesheets.length === 0 && (
                <small className="text-gray-500 mt-1 block">
                  No casesheets found for this patient
                </small>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              onClick={handleNext}
              disabled={!selectedPatient || !selectedCasesheet}
            />
          </div>
        </div>
      </Card>
    </Layout>
  );
}
