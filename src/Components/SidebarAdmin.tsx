// Icons
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineDashboard } from "react-icons/md";
import { useState } from "react";
import { Navigate, Outlet } from "react-router";
import { RiAdminLine } from "react-icons/ri";
import { PiChalkboardTeacher, PiStudent } from "react-icons/pi";
import { FaRegBuilding, FaUserTie } from "react-icons/fa";
import { IoBook } from "react-icons/io5";
import { HiMiniAcademicCap } from "react-icons/hi2";
import type { MenuItem } from "../types";
import UserLayout from "./UserLayout";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router";

const menuItems: MenuItem[] = [
  {
    icons: <MdOutlineDashboard size={30} />,
    label: "Dashboard",
    href: "/admin/dashboard",
  },

  {
    icons: <RiAdminLine size={30} />,
    label: "Administradores",
    href: "/admin/administrators",
  },
  {
    icons: <FaUserTie size={30} />,
    label: "Directores",
    href: "/admin/dashboard",
  },
  {
    icons: <PiChalkboardTeacher size={30} />,
    label: "Profesores",
    href: "/admin/teachers",
  },
  {
    icons: <PiStudent size={30} />,
    label: "Alumnos",
    href: "/admin/students",
  },
  {
    icons: <FaRegBuilding size={30} />,
    label: "Instituciones",
    href: "/admin/institutions",
  },
  {
    icons: <HiMiniAcademicCap size={30} />,
    label: "Niveles Académicos",
    href: "/admin/academic-levels",
  },
  {
    icons: <TbReportSearch size={30} />,
    label: "Grados Académicos",
    href: "/admin/academic-grades",
  },
  {
    icons: <IoBook size={30} />,
    label: "Cursos",
    href: "/admin/courses",
  },
];

interface Props {
  allowedRoles: string[];
}

const SidebarAdmin = ({ allowedRoles }: Props) => {
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

export default SidebarAdmin;
