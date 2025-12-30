"use client";
import CasesheetForm from "@/app/Components/CaseSheetForm";
import Layout from "@/app/Components/Layout";
import { useParams } from "next/navigation";

const AddCaseSheet = () => {
  const params = useParams();
  const patientId = params.patientId as string;
  return (
    <Layout>
      <CasesheetForm patientId={patientId} />
    </Layout>
  );
};

export default AddCaseSheet;
