import { useState } from "react";
import { FaRegBuilding } from "react-icons/fa";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { MdOutlineDashboard } from "react-icons/md";
import UserLayout from "./UserLayout";
import { Outlet } from "react-router";
import type { MenuItem } from "../types";

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
    icons: <HiMiniAcademicCap size={30} />,
    label: "Secciones",
    href: "/profesor/sections",
  },
];


const SidebarTeacher = () => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <UserLayout
      open={open}
      setOpen={setOpen}
      userType={"TEACHER"}
      menuItems={menuItems}
    >
      <Outlet />
    </UserLayout>
  );
};

export default SidebarTeacher;
