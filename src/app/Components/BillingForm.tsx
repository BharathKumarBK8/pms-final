"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Billing } from "../model"; // assuming you have a Billing model

interface BillingFormProps {
  treatmentId: string;
  billingId?: string;
  mode: "view" | "edit" | "add";
  onSave?: () => void;
  onCancel?: () => void;
}

export interface BillingFormRef {
  submitForm: () => void;
}

const BillingForm = forwardRef<BillingFormRef, BillingFormProps>(
  ({ treatmentId, billingId, mode, onSave, onCancel }, ref) => {
    const [formData, setFormData] = useState<Billing>({
      id: billingId || "",
      treatmentId,
      totalCost: 0,
      discountAmount: 0, // Ensure discountAmount starts as 0 if undefined
      finalAmount: 0,
      status: "Unpaid",
    });

    const statusOptions = [
      { label: "Unpaid", value: "Unpaid" },
      { label: "Partially Paid", value: "Partially Paid" },
      { label: "Paid", value: "Paid" },
    ];

    const isReadOnly = mode === "view";

    useEffect(() => {
      if (billingId) {
        // Fetch billing data if we're in edit mode
        fetch(`http://localhost:5000/api/billings/${billingId}`)
          .then((res) => res.json())
          .then((data) =>
            setFormData({
              ...data,
              discountAmount: data.discountAmount || 0, // Ensure default value is set
            }),
          )
          .catch((err) => console.error("Error fetching billing:", err));
      }
    }, [billingId]);

    const handleSubmit = async () => {
      try {
        const url = billingId
          ? `http://localhost:5000/api/billings/${billingId}`
          : "http://localhost:5000/api/billings";
        const method = billingId ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok && onSave) {
          onSave();
        } else {
          console.error("Failed to save billing data");
        }
      } catch (error) {
        console.error("Error saving billing data:", error);
      }
    };

    // Update final amount based on total cost and discount
    const calculateFinalAmount = () => {
      const { totalCost, discountAmount } = formData;
      setFormData({
        ...formData,
        finalAmount: totalCost - discountAmount,
      });
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
              ? "New Billing"
              : mode === "edit"
                ? "Edit Billing"
                : "Billing Details"}
          </h2>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Treatment ID</label>
              <InputText
                value={formData.treatmentId}
                disabled
                className="p-disabled"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Total Cost</label>
              <InputNumber
                value={formData.totalCost}
                onValueChange={(e) =>
                  setFormData({ ...formData, totalCost: e.value || 0 })
                }
                onBlur={calculateFinalAmount}
                disabled={isReadOnly}
                mode="currency"
                currency="USD"
                showButtons
              />
            </div>

            <div className="form-field">
              <label className="form-label">Discount Amount</label>
              <InputNumber
                value={formData.discountAmount}
                onValueChange={(e) =>
                  setFormData({ ...formData, discountAmount: e.value || 0 })
                }
                onBlur={calculateFinalAmount}
                disabled={isReadOnly}
                mode="currency"
                currency="USD"
                showButtons
              />
            </div>

            <div className="form-field">
              <label className="form-label">Final Amount</label>
              <InputNumber
                value={formData.finalAmount}
                disabled
                mode="currency"
                currency="USD"
                className="p-disabled"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Status</label>
              <Dropdown
                value={formData.status}
                options={statusOptions}
                onChange={(e) => setFormData({ ...formData, status: e.value })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="form-footer">
            <Button
              label={mode === "edit" || mode === "add" ? "Save" : "Close"}
              icon="pi pi-save"
              onClick={handleSubmit}
              className="btn-primary"
              disabled={isReadOnly}
            />
            {onCancel && (
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={onCancel}
                className="btn-secondary"
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

BillingForm.displayName = "BillingForm";

export default BillingForm;
