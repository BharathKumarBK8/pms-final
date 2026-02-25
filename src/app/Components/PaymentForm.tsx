"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { InputText } from "primereact/inputtext";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

interface PaymentFormProps {
  invoiceId: string;
  mode: "view" | "edit" | "add";
  onSave?: () => void;
  onCancel?: () => void;
}

export interface PaymentFormRef {
  submitForm: () => void;
}

interface PaymentFormData {
  invoiceId: string;
  paymentDate: Date | null;
  paymentMode: string;
  paymentAmount: number;
  remainingAmount: number;
  referenceNumber: string;
}

const PaymentForm = forwardRef<PaymentFormRef, PaymentFormProps>(
  ({ invoiceId, mode, onSave, onCancel }, ref) => {
    const [formData, setFormData] = useState<PaymentFormData>({
      invoiceId,
      paymentDate: new Date(),
      paymentMode: "Cash",
      paymentAmount: 0,
      remainingAmount: 0,
      referenceNumber: "",
    });

    const [invoiceAmount, setInvoiceAmount] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const isReadOnly = mode === "view";

    const paymentModes = [
      { label: "Cash", value: "Cash" },
      { label: "Card", value: "Card" },
      { label: "Online", value: "Online" },
    ];

    // Fetch invoice data to calculate remaining amount
    useEffect(() => {
      // Mock fetch; replace with API call
      fetch(`http://localhost:5000/api/invoices/${invoiceId}`)
        .then((res) => res.json())
        .then((data) => {
          setInvoiceAmount(data.finalAmount);
          setPaidAmount(data.paidAmount || 0);
          setFormData((prev) => ({
            ...prev,
            remainingAmount: data.finalAmount - (data.paidAmount || 0),
          }));
        })
        .catch((err) => console.error("Failed to fetch invoice:", err));
    }, [invoiceId]);

    const handleSubmit = async () => {
      try {
        const url =
          mode === "edit"
            ? `http://localhost:5000/api/payments/${invoiceId}`
            : "http://localhost:5000/api/payments";

        const method = mode === "edit" ? "PUT" : "POST";

        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (onSave) onSave();
      } catch (err) {
        console.error("Error saving payment:", err);
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    return (
      <div className="form-container">
        <div className="form-card">
          <h2
            className="section-title"
            style={{ marginBottom: "2rem", borderBottom: "none" }}
          >
            {mode === "add"
              ? "New Payment"
              : mode === "edit"
                ? "Edit Payment"
                : "Payment Details"}
          </h2>

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Payment Date</label>
              <Calendar
                value={formData.paymentDate}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDate: e.value || null })
                }
                disabled={isReadOnly}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Payment Mode</label>
              <Dropdown
                value={formData.paymentMode}
                options={paymentModes}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMode: e.value })
                }
                disabled={isReadOnly}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Payment Amount</label>
              <InputNumber
                value={formData.paymentAmount}
                onValueChange={(e: InputNumberValueChangeEvent) => {
                  const val = e.value ?? 0;
                  setFormData({
                    ...formData,
                    paymentAmount: val,
                    remainingAmount: invoiceAmount - paidAmount - val,
                  });
                }}
                mode="currency"
                currency="USD"
                min={0}
                max={invoiceAmount - paidAmount}
                disabled={isReadOnly}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Remaining Amount</label>
              <InputNumber
                value={formData.remainingAmount}
                mode="currency"
                currency="USD"
                disabled
              />
            </div>

            <div className="form-field">
              <label className="form-label">Reference Number</label>
              <InputText
                value={formData.referenceNumber}
                onChange={(e) =>
                  setFormData({ ...formData, referenceNumber: e.target.value })
                }
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

PaymentForm.displayName = "PaymentForm";

export default PaymentForm;
