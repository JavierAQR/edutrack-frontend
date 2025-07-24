import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import type { UserType } from "../types";
import { FaBirthdayCake, FaEnvelope, FaUser, FaUserTag } from "react-icons/fa";

interface UserProfile {
  username: string;
  name: string;
  lastname: string;
  email: string;
  userType: UserType;
  birthdate: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error obteniendo usuario:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!user) return <p>No hay usuario autenticado</p>;

  return (
    <>
        <div className="flex justify-around w-full pb-10 max-md:flex-col mt-5">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 leading-tight">
            Bienvenido,
            <span className="text-blue-500 block">
              {user.name} {user.lastname}
            </span>
          </h2>

          <div className="grid grid-cols-2 gap-6 text-gray-700 text-base">
            <div className="flex items-center gap-4">
              <FaUser className="text-blue-500 text-lg" />
              <div>
                <div className="font-semibold">Usuario:</div>
                <div>{user.username}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaEnvelope className="text-blue-500 text-lg" />
              <div>
                <div className="font-semibold">Correo:</div>
                <div>{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaUserTag className="text-blue-500 text-lg" />
              <div>
                <div className="font-semibold">Rol:</div>
                <div>{user.userType}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaBirthdayCake className="text-blue-500 text-lg" />
              <div>
                <div className="font-semibold">Cumpleaños:</div>
                <div>{user.birthdate}</div>
              </div>
            </div>
          </div>
        </div>

    </>
  );
};

export default Profile;
