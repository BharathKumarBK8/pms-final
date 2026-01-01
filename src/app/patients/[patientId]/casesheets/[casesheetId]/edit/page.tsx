"use client";
import CasesheetForm from "@/app/Components/CaseSheetForm";
import Layout from "@/app/Components/Layout";
import { useParams } from "next/navigation";

const EditCaseSheet = () => {
  const params = useParams();
  const patientId = params.patientId as string;
  const casesheetId = params.casesheetId as string;
  return (
    <Layout>
      <CasesheetForm
        patientId={patientId}
        casesheetId={casesheetId}
        mode="edit"
      />
    </Layout>
  );
};

export default EditCaseSheet;
