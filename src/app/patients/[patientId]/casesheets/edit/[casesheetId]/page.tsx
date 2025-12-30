"use client";
import CasesheetForm from "@/app/Components/CaseSheetForm";
import { useParams } from "next/navigation";

const EditCaseSheet = () => {
  const params = useParams();
  const patientId = params.patientId as string;
  const casesheetId = params.casesheetId as string;
  return <CasesheetForm patientId={patientId} casesheetId={casesheetId} />;
};

export default EditCaseSheet;
