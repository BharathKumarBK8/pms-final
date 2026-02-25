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
  casesheetId?: string; // link to Casesheet
  treatmentName: string;
  description?: string;
  plannedDate?: Date;
  performedDate?: Date;
  status: "Planned" | "In Progress" | "Completed" | "Cancelled";
  performedById?: string; // link to User
  cost: number;
}

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
  billingId: string; // link to Billing
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
  amount: number;
  paymentMethod: "Cash" | "Card" | "UPI" | "Bank Transfer";
  paidOn: Date;
  receivedById: string; // link to User
  notes?: string;
}
