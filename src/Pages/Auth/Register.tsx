import axios from "axios";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";
import type { Institution, UserType } from "../../types";

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [institutionId, setInstitution] = useState("");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [userType, setUserType] = useState<UserType>("STUDENT");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const [instRes] = await Promise.all([
        axios.get("http://localhost:8080/admin/institutions/dto"),
      ]);
      setInstitutions(instRes.data);
    } catch (err) {
      console.error("Error cargando datos", err);
    }
  };

  async function save(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          username,
          name,
          lastname,
          email,
          birthdate,
          password,
          institutionId,
          userType,
        }
      );

      if (response.data.authStatus == "USER_CREATED_SUCCESSFULLY") {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(response.data.message || "No se pudo completar el registro.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (axios.isAxiosError(err) && err.response?.data?.authStatus === "USER_NOT_CREATED") {
        setError("No se pudo crear el usuario. Por favor, intente nuevamente.");
      } else {
        setError("Error en el registro. Por favor intente más tarde.");
      }
      console.error("Error detallado: ", err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Registro de Usuario
          </h2>
        </div>

        {error !== "" && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-1"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
        )}

        {successMessage !== "" && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-1"
            role="alert"
          >
            <strong className="font-bold">Éxito:</strong>
            <span className="block sm:inline ml-1">{successMessage}</span>
          </div>
        )}

        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4 p-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                required
                type="text"
                className="appearance-none block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ej. juan123"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombres
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                required
                className="appearance-none block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Juan Carlos"
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Apellidos
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={lastname}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLastname(e.target.value)
                }
                required
                className="appearance-none block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Pérez López"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
                className="appearance-none block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
                className="appearance-none block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                required
                className="appearance-none block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="birthdate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha de nacimiento
              </label>
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                value={birthdate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setBirthdate(e.target.value)
                }
                required
                className="appearance-none block w-full px-3 py-2 border text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="birthdate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo de usuario
              </label>
              <select
                name="userType"
                id="userType"
                value={userType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setUserType(e.target.value as UserType)
                }
                className="block w-full px-3 py-2 border text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="STUDENT">Estudiante</option>
                <option value="TEACHER">Profesor(a)</option>
                <option value="PARENT">Apoderado</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="institution"
                className="block text-sm font-medium text-gray-700"
              >
                Institución
              </label>
              <select
                value={institutionId}
                name="institutionId"
                id="institutionId"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setInstitution(e.target.value)}
                required
                className="border p-2 rounded mt-1 w-full"
              >
                <option value="" disabled>
                  Seleccionar institución
                </option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              onClick={save}
            >
              Registrarse
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
