import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { MdMenuOpen } from "react-icons/md";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import type { MenuItem } from "../types";

interface Props {
  children: ReactNode;
  menuItems: MenuItem[];
  userType: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const UserLayout = ({
  children,
  userType,
  menuItems,
  open,
  setOpen,
}: Props) => {
  return (
    <div className="flex">
      <nav
        className={`fixed shadow-md h-screen p-2 flex flex-col duration-500 bg-blue-600 text-white ${
          open ? "w-60" : "w-16"
        }`}
      >
        {/* Header */}
        <div className="px-3 py-2 h-20 flex justify-between items-center">
          <div
            className={`flex items-center gap-3 ${
              open ? "w-10" : "hidden"
            } rounded-md`}
          >
            <img
              src={"https://cdn-icons-png.flaticon.com/512/6671/6671494.png"}
              alt="Logo"
            />
            <span className="font-bold text-xl">{userType}</span>
          </div>

          <MdMenuOpen
            size={34}
            className={`duration-500 cursor-pointer ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Body */}
        <div className="flex-1">
          {menuItems.map((item, index) => (
            <Link
              to={item.href}
              key={index}
              className="px-3 py-2 my-2 hover:bg-blue-800 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group"
            >
              <div>{item.icons}</div>
              <p
                className={`${
                  !open && "w-0 translate-x-24"
                } duration-500 overflow-hidden`}
              >
                {item.label}
              </p>
              <p
                className={`${
                  open && "hidden"
                } absolute left-32 shadow-md rounded-md w-0 p-0 text-black bg-white duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16`}
              >
                {item.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-3 py-2">
          <UserDropdown />
        </div>
      </nav>
      <main className={`w-full ${open ? "ml-60" : "ml-16"}`}>
        <div className="mt-10 max-w-6xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default UserLayout;
