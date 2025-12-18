"use client";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";

interface RouterContextType {
  navigateToPatientEdit: (id: string) => void;
  navigateToAddTreatment: (patientId: string) => void;
  navigateToTreatmentEdit: (patientId: string, treatmentId: string) => void;
  navigateToPatientsList: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const navigateToPatientEdit = (id: string) =>
    router.push(`/patients/edit/${id}`);

  const navigateToAddTreatment = (patientId: string) =>
    router.push(`/patients/${patientId}/treatments/add`);

  const navigateToTreatmentEdit = (patientId: string, treatmentId: string) =>
    router.push(`/patients/${patientId}/treatments/edit/${treatmentId}`);

  const navigateToPatientsList = () => router.push(`/patients`);

  return (
    <RouterContext.Provider
      value={{
        navigateToPatientEdit,
        navigateToAddTreatment,
        navigateToTreatmentEdit,
        navigateToPatientsList,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useAppRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useAppRouter must be used within RouterProvider");
  }
  return context;
};
