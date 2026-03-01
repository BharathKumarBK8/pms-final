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
  id?: string;
  code?: string; // e.g., "PAT-2026-0001"
  name: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  phoneNumber?: string;
  status: "Active" | "Inactive";
  previousConditions?: string[];
  autoCreateVisit: boolean; // flag to auto-create visit after patient creation
}

// --------------------
// 3. Visit
// --------------------+++
// Represents a patient coming to the clinic
export interface Visit {
  id?: string;
  patientId: string;
  status: "Open" | "Closed";
  arrivedAt: Date;
  finishedAt?: Date;
}

// --------------------
// 4. Casesheet
// --------------------
// Medical record, may or may not be tied to a visit
export interface Casesheet {
  id?: string;
  code?: string; // e.g., "CS-2026-0001"
  patientId: string;
  doctorId: string;
  visitId: string; // optional link to Visit
  date: Date;
  chiefComplaint: string;
  diagnosis: string;
  treatmentPlan: string;
  status: "Open" | "Closed";
}

// --------------------
// 5. Treatment
// --------------------
// Each procedure or service performed
export interface Treatment {
  id?: string;
  code?: string; // e.g., "T-2026-0001"
  visitId: string;
  casesheetId?: string; // optional
  treatmentName: string;
  description?: string;
  performedDate?: Date;
  performedById?: string; // link to User
  status: "Planned" | "Completed" | "Cancelled";
  cost: number;
}

// --------------------
// 6. Billing
// --------------------
// One per Visit, aggregates all treatments of that visit
export interface Billing {
  id?: string;
  code?: string; // e.g., "BIL-2026-0001"
  visitId: string; // link to Visit
  totalCost: number;
  discountAmount?: number;
  finalAmount: number;
}

// --------------------
// 7. Invoice
// --------------------
// Financial document, can be partially paid
export interface Invoice {
  id?: string;
  code?: string; // e.g., "INV-2026-0001"
  billingId: string; // link to Billing
  patientId: string;
  totalAmount: number; // sum of treatments via billing
  discountAmount?: number;
  finalAmount: number;
  status: "Unpaid" | "Partially Paid" | "Paid";
  createdAt: Date;
}

// --------------------
// 8. Payment
// --------------------
// Payment linked to invoice
export interface Payment {
  id?: string;
  code?: string; // e.g., "PAY-2026-0001"
  invoiceId: string; // link to Invoice
  amount: number;
  paymentMethod: "Cash" | "Card" | "UPI" | "Bank Transfer";
  paidOn: Date;
  receivedById: string; // link to User
  notes?: string;
}
