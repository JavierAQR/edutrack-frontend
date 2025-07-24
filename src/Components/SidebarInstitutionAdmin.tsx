import { useState } from "react";
import { RiBook2Line, RiGraduationCapLine, RiTeamLine, RiUser3Line } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import type { MenuItem } from "../types";
import UserLayout from "./UserLayout";

const menuItems: MenuItem[] = [
  {
    icons: <RiGraduationCapLine size={20} />,
    label: "Grados Académicos",
    href: "/institution-admin/grades",
  },
  {
    icons: <RiUser3Line size={20} />,
    label: "Profesores",
    href: "/institution-admin/teachers",
  },
  {
    icons: <RiTeamLine size={20} />,
    label: "Estudiantes",
    href: "/institution-admin/students",
  },
  {
    icons: <RiBook2Line size={20} />,
    label: "Cursos",
    href: "/institution-admin/courses",
  },
  {
    icons: <RiGraduationCapLine size={20} />,
    label: "Secciones",
    href: "/institution-admin/sections",
  },
];

const SidebarInstitutionAdmin = () => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <UserLayout
      open={open}
      setOpen={setOpen}
      userType={"INST_ADM"}
      menuItems={menuItems}
    >
      <Outlet />
    </UserLayout>
  );
};

export default SidebarInstitutionAdmin;
