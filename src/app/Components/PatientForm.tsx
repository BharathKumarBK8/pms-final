"use client";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function PatientForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    status: "Active",
  });

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push("/patients");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <div className="grid gap-4">
        <div>
          <label className="block mb-2">Name</label>
          <InputText
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Age</label>
          <InputText
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Gender</label>
          <Dropdown
            value={formData.gender}
            options={genderOptions}
            onChange={(e) => setFormData({ ...formData, gender: e.value })}
            required
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Phone</label>
          <InputText
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Status</label>
          <Dropdown
            value={formData.status}
            options={statusOptions}
            onChange={(e) => setFormData({ ...formData, status: e.value })}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button type="submit" label="Save" icon="pi pi-check" />
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            onClick={() => router.push("/patients")}
          />
        </div>
      </div>
    </form>
  );
}
