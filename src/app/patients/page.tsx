import Table from "../Components/Table";
import Layout from "../Components/Layout";

export default function PatientsPage() {
  const columns = [
    { field: "id", header: "ID", sortable: true },
    { field: "name", header: "Name", sortable: true },
    { field: "age", header: "Age", sortable: true },
    { field: "gender", header: "Gender", sortable: true },
    { field: "phone", header: "Phone" },
    { field: "status", header: "Status", sortable: true, isStatus: true },
  ];

  return (
    <Layout>
      <Table
        title="Patient Records"
        endpoint="/api/patients"
        columns={columns}
      />
    </Layout>
  );
}
