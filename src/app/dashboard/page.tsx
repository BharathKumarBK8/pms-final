import Layout from "../Components/Layout";
import ProtectedRoute from "../Components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <Layout>
      <ProtectedRoute>
        <div className="text-xl font-semibold">Welcome to the Dashboard</div>
      </ProtectedRoute>
    </Layout>
  );
}
