"use client";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";

interface RouterContextType {
  navigateToPatientAdd: () => void;
  navigateToTreatmentAdd: () => void;
  navigateToPatientEdit: (patientId: string) => void;
  navigateToPatientView: (patientId: string) => void;
  navigateToCasesheetAdd: (patientId: string) => void;
  navigateToCasesheetEdit: (patientId: string, casesheetId: string) => void;
  navigateToCasesheetView: (patientId: string, casesheetId: string) => void;
  navigateToAddTreatmentviaCasesheet: (
    patientId: string,
    casesheetId: string,
  ) => void;
  navigateToEditTreatmentviaCasesheet: (
    patientId: string,
    casesheetId: string,
    treatmentId: string,
  ) => void;
  navigateToViewTreatmentviaCasesheet: (
    patientId: string,
    casesheetId: string,
    treatmentId: string,
  ) => void;
  navigateToAddBilling: (treatmentId: string) => void;
  navigateToAddInvoice: (billingId: string) => void;
  navigateToAddPayment: (invoiceId: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const navigateToPatientAdd = () => router.push(`/patients/add`);
  const navigateToTreatmentAdd = () => router.push(`/treatments/add`);
  const navigateToPatientEdit = (patientId: string) =>
    router.push(`/patients/${patientId}/edit`);
  const navigateToPatientView = (patientId: string) =>
    router.push(`/patients/${patientId}`);
  const navigateToCasesheetAdd = (patientId: string) =>
    router.push(`/casesheets/add?patientId=${patientId}`);
  const navigateToCasesheetEdit = (patientId: string, casesheetId: string) =>
    router.push(`/casesheets/${casesheetId}/edit?patientId=${patientId}`);
  const navigateToCasesheetView = (patientId: string, casesheetId: string) =>
    router.push(`/casesheets/${casesheetId}?patientId=${patientId}`);
  const navigateToAddTreatmentviaCasesheet = (
    patientId: string,
    casesheetId: string,
  ) =>
    router.push(
      `/treatments/add?patientId=${patientId}&casesheetId=${casesheetId}`,
    );
  const navigateToEditTreatmentviaCasesheet = (
    patientId: string,
    casesheetId: string,
    treatmentId: string,
  ) =>
    router.push(
      `/treatments/${treatmentId}/edit?patientId=${patientId}&casesheetId=${casesheetId}`,
    );
  const navigateToViewTreatmentviaCasesheet = (
    patientId: string,
    casesheetId: string,
    treatmentId: string,
  ) =>
    router.push(
      `/treatments/${treatmentId}?patientId=${patientId}&casesheetId=${casesheetId}`,
    );
  const navigateToAddBilling = (treatmentId: string) =>
    router.push(`/billings/add?treatmentId=${treatmentId}`);
  const navigateToAddInvoice = (billingId: string) =>
    router.push(`/invoices/add?billingId=${billingId}`);
  const navigateToAddPayment = (invoiceId: string) =>
    router.push(`/payments/add?invoiceId=${invoiceId}`);

  return (
    <RouterContext.Provider
      value={{
        navigateToPatientAdd,
        navigateToTreatmentAdd,
        navigateToPatientEdit,
        navigateToPatientView,
        navigateToCasesheetAdd,
        navigateToCasesheetEdit,
        navigateToCasesheetView,
        navigateToAddTreatmentviaCasesheet,
        navigateToEditTreatmentviaCasesheet,
        navigateToViewTreatmentviaCasesheet,
        navigateToAddBilling,
        navigateToAddInvoice,
        navigateToAddPayment,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useAppRouter = () => {
  const context = useContext(RouterContext);
  if (!context)
    throw new Error("useAppRouter must be used within RouterProvider");
  return context;
};
