// model.ts

// --------------------
// 1. Clinic
// --------------------
export interface Clinic {
  id: string;
  name: string;
  location: string;
  address?: string;
  phoneNumber?: string;
  status: "Active" | "Inactive";
}

// --------------------
// 2. User (internal staff / doctor / admin)
// --------------------
export interface User {
  id: string;
  clinicIds: string[]; // primary clinic for the user
  role: "owner" | "admin" | "doctor" | "staff";
  email: string;
  displayName?: string;
  status: "active" | "inactive";
}

// --------------------
// 3. Patient
// --------------------
export interface Patient {
  id: string;
  primaryClinicId: string; // primary clinic for the patient
  name: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  phoneNumber?: string;
  status: "Active" | "Inactive";
  previousConditions?: string[];
}

// --------------------
// 4. Casesheet
// --------------------
export interface Casesheet {
  id: string;
  clinicId: string; // clinic where this case belongs
  patientId: string; // link to Patient
  doctorId?: string; // optional doctor assignment
  date: Date;
  chiefComplaint: string;
  diagnosis: string;
  treatmentPlan: string;
  status: "Open" | "Closed";
}

// --------------------
// 5. Treatment
// --------------------
export interface Treatment {
  id: string;
  clinicId: string; // clinic where treatment occurs
  casesheetId: string; // link to Casesheet
  date: Date;
  treatmentName: string;
  toothNumber?: string; // optional for dental
  performedById: string; // doctor/staff performing
  cost: number;
  status: "Planned" | "In Progress" | "Completed" | "Cancelled";
}
