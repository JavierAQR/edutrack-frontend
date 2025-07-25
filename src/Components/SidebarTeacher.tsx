import { useState } from "react";
import { FaRegBuilding } from "react-icons/fa";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { IoBook } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import UserLayout from "./UserLayout";
import { Navigate, Outlet } from "react-router";
import type { MenuItem } from "../types";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router";

const menuItems: MenuItem[] = [
  {
    icons: <FaRegBuilding size={30} />,
    label: "Mi Perfil",
    href: "/profesor",
  },
  {
    icons: <MdOutlineDashboard size={30} />,
    label: "Dashboard",
    href: "/profesor",
  },
  {
    icons: <IoBook size={30} />,
    label: "Cursos",
    href: "/profesor",
  },
  {
    icons: <PiStudent size={30} />,
    label: "Alumnos",
    href: "/profesor",
  },

  {
    icons: <HiMiniAcademicCap size={30} />,
    label: "Secciones",
    href: "/profesor",
  },
];

interface Props {
  allowedRoles: string[];
}

const SidebarTeacher = ({ allowedRoles }: Props) => {
  const [open, setOpen] = useState<boolean>(true);
  const { user, isloading } = useAuth();
  const location = useLocation();

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
  

  return (
    <UserLayout
      open={open}
      setOpen={setOpen}
      userType={user.role}
      menuItems={menuItems}
    >
      <Outlet />
    </UserLayout>
  );
};

export default SidebarTeacher;
