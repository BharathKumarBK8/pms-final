"use client";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";

interface RouterContextType {
  navigateToPatientAdd: () => void;
  navigateToTreatmentAdd: () => void;
  navigateToPatientEdit: (patientId: string) => void;
  navigateToPatientView: (patientId: string) => void;
  navigateToAddTreatment: (patientId: string) => void;
  navigateToTreatmentEdit: (patientId: string, treatmentId: string) => void;
  navigateToTreatmentView: (patientId: string, treatmentId: string) => void;
  navigateToPatientsList: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const navigateToPatientAdd = () => router.push(`/patients/add`);
  const navigateToTreatmentAdd = () => router.push(`/treatments/add`);
  const navigateToPatientEdit = (patientId: string) =>
    router.push(`/patients/edit/${patientId}`);
  const navigateToPatientView = (patientId: string) =>
    router.push(`/patients/view/${patientId}`);
  const navigateToAddTreatment = (patientId: string) =>
    router.push(`/patients/${patientId}/treatments/add`);
  const navigateToTreatmentEdit = (patientId: string, treatmentId: string) =>
    router.push(`/patients/${patientId}/treatments/edit/${treatmentId}`);
  const navigateToTreatmentView = (patientId: string, treatmentId: string) =>
    router.push(`/patients/${patientId}/treatments/view/${treatmentId}`);
  const navigateToPatientsList = () => router.push(`/patients`);

  return (
    <RouterContext.Provider
      value={{
        navigateToPatientAdd,
        navigateToTreatmentAdd,
        navigateToPatientEdit,
        navigateToPatientView,
        navigateToAddTreatment,
        navigateToTreatmentEdit,
        navigateToTreatmentView,
        navigateToPatientsList,
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
