import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg" />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
