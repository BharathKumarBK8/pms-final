// --------------------
// 1. User
// --------------------
export interface User {
  id: string;
  code?: string; // e.g., "USR-2026-0001"
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
  code?: string; // e.g., "PAT-2026-0001"
  name: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  phoneNumber?: string;
  status: "Active" | "Inactive";
  previousConditions?: string[];
}

// --------------------
// 3. Casesheet
// --------------------
export interface Casesheet {
  id: string;
  code?: string; // e.g., "CS-2026-0001"
  patientId: string; // link to Patient
  doctorId: string; // link to User
  date: Date;
  chiefComplaint: string;
  diagnosis: string;
  treatmentPlan: string;
  status: "Open" | "Closed";
}

// --------------------
// 4. Treatment
// --------------------
export interface Treatment {
  id: string;
  code?: string; // e.g., "T-2026-0001"
  casesheetId?: string; // optional - consultations can be standalone
  treatmentName: string;
  description?: string;
  performedDate?: Date;
  status: "Planned" | "Completed" | "Cancelled";
  performedById?: string; // link to User
  cost: number;
}

// --------------------
// 5. Billing
// --------------------
export interface Billing {
  id: string;
  code?: string; // e.g., "BIL-2026-0001"
  treatmentId: string; // 1:1 per treatment
  invoiceId?: string; // optional until grouped into invoice
  totalCost: number;
  discountAmount?: number | 0;
  finalAmount: number;
}

// --------------------
// 6. Invoice
// --------------------
export interface Invoice {
  id: string;
  code?: string; // e.g., "INV-2026-0001"
  patientId: string;
  casesheetId?: string; // optional - for organization
  totalAmount: number; // sum of linked billings
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
  code?: string; // e.g., "PAY-2026-0001"
  invoiceId: string; // link to Invoice
  amount: number;
  paymentMethod: "Cash" | "Card" | "UPI" | "Bank Transfer";
  paidOn: Date;
  receivedById: string; // link to User
  notes?: string;
}
