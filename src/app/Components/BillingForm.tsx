"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAppRouter } from "../context/RouterContext";
import { Billing } from "../model"; // assuming you have a Billing model
import Table from "./Table";

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
    const { navigateToAddInvoice } = useAppRouter();
    const [formData, setFormData] = useState<Billing>({
      id: billingId || "",
      treatmentId,
      totalCost: 0,
      discountAmount: 0, // Ensure discountAmount starts as 0 if undefined
      finalAmount: 0,
    });

    const [invoices, setInvoices] = useState<any>(null); // Replace 'any' with your Invoice type if available
    const isReadOnly = mode === "view";

    const invoiceColumns = [
      { field: "id", header: "Invoice ID", sortable: true },
      { field: "totalAmount", header: "Total Amount", sortable: true },
      { field: "discountAmount", header: "Discount Amount", sortable: true },
      { field: "finalAmount", header: "Final Amount", sortable: true },
    ];

    useEffect(() => {
      if (!billingId) return;
      const fetchData = async () => {
        try {
          const [billingRes, invoicesRes] = await Promise.all([
            fetch(`http://localhost:5000/api/billings/${billingId}`),
            fetch(`http://localhost:5000/api/invoices?billingId=${billingId}`),
          ]);
          const billingData = await billingRes.json();
          const invoicesData = await invoicesRes.json();
          setFormData({
            ...billingData,
            discountAmount: billingData.discountAmount || 0,
          });
          setInvoices(invoicesData);
        } catch (error) {
          console.error("Error fetching billing or invoices:", error);
        }
      };

      fetchData();
    }, [billingId, treatmentId]);

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
        finalAmount: discountAmount ? totalCost - discountAmount : totalCost,
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
                currency="INR"
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
                currency="INR"
                showButtons
              />
            </div>

            <div className="form-field">
              <label className="form-label">Final Amount</label>
              <InputNumber
                value={formData.finalAmount}
                disabled
                mode="currency"
                currency="INR"
                className="p-disabled"
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

        {billingId && (
          <div className="form-card">
            <div className="section-header">
              <h3 className="section-title">Invoices</h3>
              {mode !== "view" && (
                <Button
                  label="Add Invoice"
                  className="btn-primary"
                  icon="pi pi-plus"
                  onClick={() => navigateToAddInvoice(billingId)}
                />
              )}
            </div>
            <Table
              title={`Invoices for Billing ${billingId}`}
              data={invoices}
              columns={invoiceColumns}
              mode={mode}
            />
          </div>
        )}
      </div>
    );
  },
);

BillingForm.displayName = "BillingForm";

export default BillingForm;
