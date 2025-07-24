import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

interface Props {
  allowedRoles: string[];
}

const VerificationRole = ({ allowedRoles }: Props) => {
  const { user, isloading } = useAuth();

  if (isloading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Usuario autenticado pero sin permisos
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default VerificationRole;
