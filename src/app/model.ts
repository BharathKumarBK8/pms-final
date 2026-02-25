// --------------------
// 1. User
// --------------------
export interface User {
  id: string;
  role: "owner" | "admin" | "doctor" | "staff";
  email: string;
  displayName?: string;
  status: "active" | "inactive";
}

// --------------------
// 2. Patient
// --------------------
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  phoneNumber?: string;
  status: "Active" | "Inactive";
  previousConditions?: string;
}

// --------------------
// 3. Casesheet
// --------------------
export interface Casesheet {
  id: string;
  patientId: string; // link to Patient
  date: Date;
  chiefComplaint: string;
  onDiagnosis: string;
  treatmentPlan: string;
  treatmentPending?: string;
}

// --------------------
// 4. Treatment
// --------------------
export interface Treatment {
  id: string;
  patientId: string; // link to Patient
  casesheetId: string; // link to Casesheet
  date?: Date;
  treatmentName: string;
  toothNumber?: string;
  performedBy?: string;
  status: "Planned" | "In Progress" | "Completed" | "Cancelled";
  cost: number;
}

// --------------------
// 5. Billing
// --------------------
export interface Billing {
  id: string;
  treatmentId: string; // link to Treatment
  totalCost: number;
  discountAmount?: number;
  finalAmount: number;
  status: "Unpaid" | "Partially Paid" | "Paid";
}

// --------------------
// 6. Invoice
// --------------------
export interface Invoice {
  id: string;
  casesheetId: string; // link to Casesheet
  totalAmount: number; // sum of completed treatments
  discountAmount?: number;
  finalAmount: number;
  status: "Unpaid" | "Partially Paid" | "Paid";
  createdAt: Date;
}

// --------------------
// 7. Payment
// --------------------
export interface Payment {
  id: string;
  invoiceId: string; // link to Invoice
  paymentDate: Date | null;
  paymentMode: string;
  paymentAmount: number;
  remainingAmount?: number;
  referenceNumber?: string;
}
