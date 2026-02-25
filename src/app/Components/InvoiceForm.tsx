"use client";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useAppRouter } from "../context/RouterContext";
import Table from "./Table";

interface InvoiceFormProps {
  invoiceId?: string;
  billingId: string;
  mode: "view" | "edit" | "add";
  onSave?: () => void;
  onCancel?: () => void;
}

export interface InvoiceFormRef {
  submitForm: () => void;
}

const InvoiceForm = forwardRef<InvoiceFormRef, InvoiceFormProps>(
  ({ invoiceId, billingId, mode, onSave, onCancel }, ref) => {
    const { navigateToAddPayment } = useAppRouter();
    const [formData, setFormData] = useState({
      invoiceId: invoiceId || "",
      billingId,
      totalAmount: 0,
      discountAmount: 0,
      finalAmount: 0,
      status: "Unpaid" as "Unpaid" | "Partially Paid" | "Paid",
      createdAt: new Date(),
    });

    const statusOptions = [
      { label: "Unpaid", value: "Unpaid" },
      { label: "Partially Paid", value: "Partially Paid" },
      { label: "Paid", value: "Paid" },
    ];

    const [payments, setPayments] = useState<any[]>([]); // Replace 'any' with your Payment type if available

    const paymentColumns = [
      { field: "id", header: "Payment ID", sortable: true },
      { field: "paymentDate", header: "Payment Date", sortable: true },
      { field: "paymentMode", header: "Payment Mode", sortable: true },
      { field: "paymentAmount", header: "Payment Amount", sortable: true },
    ];

    const isReadOnly = mode === "view";

    // Recalculate finalAmount whenever totalAmount or discountAmount changes
    useEffect(() => {
      const total = Number(formData.totalAmount) || 0;
      const discount = Number(formData.discountAmount) || 0;
      setFormData((prev) => ({
        ...prev,
        finalAmount: total - discount,
      }));
    }, [formData.totalAmount, formData.discountAmount]);

    const handleSubmit = () => {
      if (onSave) onSave();
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
              ? "New Invoice"
              : mode === "edit"
                ? "Edit Invoice"
                : "Invoice Details"}
          </h2>

          <div className="form-grid">
            <div className="form-field">
              <label>Invoice ID</label>
              <InputText value={formData.invoiceId} disabled />
            </div>

            <div className="form-field">
              <label>Total Amount</label>
              <InputNumber
                value={formData.totalAmount}
                onValueChange={(e) =>
                  setFormData({ ...formData, totalAmount: e.value || 0 })
                }
                disabled={isReadOnly}
                mode="currency"
                currency="USD"
              />
            </div>

            <div className="form-field">
              <label>Discount Amount</label>
              <InputNumber
                value={formData.discountAmount}
                onValueChange={(e) =>
                  setFormData({ ...formData, discountAmount: e.value || 0 })
                }
                disabled={isReadOnly}
                mode="currency"
                currency="USD"
              />
            </div>

            <div className="form-field">
              <label>Final Amount</label>
              <InputNumber
                value={formData.finalAmount}
                disabled
                mode="currency"
                currency="USD"
              />
            </div>

            <div className="form-field">
              <label>Status</label>
              <Dropdown
                value={formData.status}
                options={statusOptions}
                onChange={(e) => setFormData({ ...formData, status: e.value })}
                disabled={isReadOnly}
              />
            </div>

            <div className="form-field">
              <label>Created At</label>
              <InputText value={formData.createdAt.toLocaleString()} disabled />
            </div>
          </div>

          {!isReadOnly && (
            <div className="mt-4 flex gap-2">
              <Button
                label="Save Invoice"
                className="btn-primary"
                onClick={handleSubmit}
              />
              {onCancel && (
                <Button
                  label="Cancel"
                  className="btn-secondary"
                  onClick={onCancel}
                />
              )}
            </div>
          )}
        </div>
        {invoiceId && (
          <div className="form-card">
            <div className="section-header">
              <h3 className="section-title">Payments</h3>
              {mode !== "view" && (
                <Button
                  label="Add Payment"
                  className="btn-primary"
                  icon="pi pi-plus"
                  onClick={() => navigateToAddPayment(invoiceId)}
                />
              )}
            </div>
            <Table
              title={`Payments for Invoice ${invoiceId}`}
              data={payments}
              columns={paymentColumns}
              mode={mode}
            />
          </div>
        )}
      </div>
    );
  },
);

InvoiceForm.displayName = "InvoiceForm";
export default InvoiceForm;
