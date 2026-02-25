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
  previousConditions?: string[];
}

// --------------------
// 3. Casesheet
// --------------------
export interface Casesheet {
  id: string;
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
  invoiceId: string; // link to Invoice
  amount: number;
  paymentMethod: "Cash" | "Card" | "UPI" | "Bank Transfer";
  paidOn: Date;
  receivedById: string; // link to User
  notes?: string;
}
