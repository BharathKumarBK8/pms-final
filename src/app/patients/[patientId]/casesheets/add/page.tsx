"use client";
import CasesheetForm from "@/app/Components/CaseSheetForm";
import { useParams } from "next/navigation";

const AddCaseSheet = () => {
  const params = useParams();
  const patientId = params.patientId as string;
  return <CasesheetForm patientId={patientId} />;
};

export default AddCaseSheet;
