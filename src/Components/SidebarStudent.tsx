import { Outlet } from 'react-router';
import UserLayout from './UserLayout';
import { useState } from 'react';
import type { MenuItem } from '../types';
import { MdOutlineDashboard } from 'react-icons/md';

const menuItems: MenuItem[] = [
  {
    icons: <MdOutlineDashboard size={30} />,
    label: "Mi Perfil",
    href: "/estudiante/perfil",
  },
  {
    icons: <MdOutlineDashboard size={30} />,
    label: "Secciones",
    href: "/estudiante/sections",
  },
  {
    icons: <MdOutlineDashboard size={30} />,
    label: "Pagos",
    href: "/estudiante/pagos",
  },

];

const SidebarStudent = () => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <UserLayout
      open={open}
      setOpen={setOpen}
      userType={"STUDENT"}
      menuItems={menuItems}
    >
      <Outlet />
    </UserLayout>
  );
};

export default SidebarStudent;