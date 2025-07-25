import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const UserDropdown = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            {open && (
                <div className="absolute left-30 bottom-0 mt-2 w-30 bg-white border border-gray-200 rounded shadow-md z-50">
                    <button
                        onClick={() => {
                            logout();
                            setOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
                    >
                        Cerrar sesión
                    </button>
                </div>
            )}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-4 focus:outline-none cursor-pointer"
            >
                <FaUserCircle size={30} />
                <span>{user?.username}</span>
            </button>

            
        </div>
    );
};

export default UserDropdown;