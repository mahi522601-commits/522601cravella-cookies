import { Navigate, Outlet } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";

const ProtectedAdminRoute = () => {
  const { adminUser, loading, initialized } = useAuth();

  if (loading || !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-brand-brown" />
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
