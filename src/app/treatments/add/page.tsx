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
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const patientOptions: PatientOption[] = data.map((patient: any) => ({
            label: `${patient.name} (ID: ${patient.id})`,
            value: patient.id,
          }));
          setPatients(patientOptions);
        } else {
          setPatients([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching patients:", err);
        setPatients([]);
      });
  }, []);

  useEffect(() => {
    if (selectedPatient && selectedPatient.value) {
      setSelectedCasesheet(null);
      fetch(
        `http://localhost:5000/api/casesheets?patientId=${selectedPatient.value}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            const casesheetOptions: CasesheetOption[] = data.map(
              (casesheet: any) => ({
                label: `${casesheet.chiefComplaint} - ${new Date(
                  casesheet.date
                ).toLocaleDateString()}`,
                value: casesheet.id,
              })
            );
            setCasesheets(casesheetOptions);
          } else {
            setCasesheets([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching casesheets:", err);
          setCasesheets([]);
        });
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
    console.log("selectedCasesheet.value:", selectedCasesheet?.value);
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
              onChange={(e) => {
                if (e.value && typeof e.value === "object" && e.value.value) {
                  setSelectedPatient(e.value);
                } else {
                  setSelectedPatient(null);
                }
              }}
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
