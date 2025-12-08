import { NextResponse } from "next/server";

// Simulated patient data
const patients = [
  {
    id: 1,
    name: "John Doe",
    age: 34,
    gender: "Male",
    phone: "+1 555-1234",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Smith",
    age: 28,
    gender: "Female",
    phone: "+1 555-6789",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Michael Johnson",
    age: 42,
    gender: "Male",
    phone: "+1 555-2755",
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Davis",
    age: 36,
    gender: "Female",
    phone: "+1 555-4466",
    status: "Active",
  },
];

export async function GET() {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 500));

  return NextResponse.json(patients);
}
