import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

// Interfaz para los datos que vienen en el token
interface JwtPayload {
  sub: string; // username
  role: string; // rol del usuario
  institutionId: number; //id de institucion de usuario
  exp: number; // expiración
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // Función para verificar si necesita completar perfil
  const checkProfileStatus = async (token: string) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/auth/profile-status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error checking profile status:", error);
      return null;
    }
  };

  const completeProfileRoutes: Record<string, string> = {
    TEACHER: "/complete-teacher-profile",
    STUDENT: "/complete-student-profile",
  };

  const redirectUser = async (role: string, token: string) => {
    if (role === "TEACHER" || role === "STUDENT") {
      const profileStatus = await checkProfileStatus(token);
      if (role in completeProfileRoutes && profileStatus?.needsProfileCompletion) {
        navigate(completeProfileRoutes[role]);
        return;
      }
    }

    switch (role) {
      case "ADMIN":
        navigate("/admin");
        break;
      case "STUDENT":
        navigate("/estudiante");
        break;
      case "TEACHER":
        navigate("/profesor");
        break;
      case "INSTITUTION_ADMIN":
        navigate("/institution-admin");
        break;
      case "PARENT":
        navigate("/padre");
        break;
      default:
        navigate("/");
    }
  };

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password,
        }
      );

      if (response.data.authStatus === "LOGIN_SUCCESS") {
        setSuccessMessage("Inicio de sesión exitoso");
        const token = response.data.token;
        localStorage.setItem("token", token);

        const decoded = jwtDecode<JwtPayload>(token);     
        const role = decoded.role;
        
        login(response.data.token, {
          username: username,
          role: role,
          institutionId: decoded.institutionId
        });

        await redirectUser(role, token);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al iniciar sesión. Por favor, intente más tarde");
      }
      console.error("Error detallado: ", err);
    }
  }

  return (
    <>
      <Navbar basic={true} />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Iniciar sesión
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
                  Usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Ej: juan123"
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Recuérdame
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                onClick={handleLogin}
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {" "}
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
