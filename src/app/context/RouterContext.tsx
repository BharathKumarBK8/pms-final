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
    casesheetId: string
  ) => void;
  navigateToEditTreatmentviaCasesheet: (
    patientId: string,
    casesheetId: string,
    treatmentId: string
  ) => void;
  navigateToViewTreatmentviaCasesheet: (
    patientId: string,
    casesheetId: string,
    treatmentId: string
  ) => void;
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
    router.push(`/patients/${patientId}/casesheets/add`);
  const navigateToCasesheetEdit = (patientId: string, casesheetId: string) =>
    router.push(`/patients/${patientId}/casesheets/${casesheetId}/edit`);
  const navigateToCasesheetView = (patientId: string, casesheetId: string) =>
    router.push(`/patients/${patientId}/casesheets/${casesheetId}`);
  const navigateToAddTreatmentviaCasesheet = (
    patientId: string,
    casesheetId: string
  ) =>
    router.push(
      `/patients/${patientId}/casesheets/${casesheetId}/treatments/add`
    );
  const navigateToEditTreatmentviaCasesheet = (
    patientId: string,
    casesheetId: string,
    treatmentId: string
  ) =>
    router.push(
      `/patients/${patientId}/casesheets/${casesheetId}/treatments/${treatmentId}/edit`
    );
  const navigateToViewTreatmentviaCasesheet = (
    patientId: string,
    casesheetId: string,
    treatmentId: string
  ) =>
    router.push(
      `/patients/${patientId}/casesheets/${casesheetId}/treatments/${treatmentId}`
    );

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
