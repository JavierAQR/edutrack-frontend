import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import type { Activity, Course } from "../types";
import Profile from "./Profile";
import Institutions from "../Components/Institutions";

const Tablero = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar si hay token
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Configuración común para las solicitudes
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Obtener información del usuario
        const userResponse = await api.get("/auth/user-info", config);
        const isTeacher = userResponse.data.userType === "TEACHER";

        // Obtener datos según el tipo de usuario
        if (isTeacher) {
          const coursesResponse = await api.get(
            "/dashboard/teacher/courses",
            config
          );
          setCourses(coursesResponse.data);
          setActivities([]);
        } else {
          const [coursesResponse, activitiesResponse] = await Promise.all([
            api.get("/dashboard/student/courses", config),
            api.get("/dashboard/student/activities", config),
          ]);
          setCourses(coursesResponse.data);
          setActivities(
            activitiesResponse.data.map((act: any) => ({
              ...act,
              dueDate: new Date(act.dueDate).toLocaleDateString(),
            }))
          );
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Error loading data"
        );
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center w-full">
          <div className="text-center">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"
              role="status"
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2 text-gray-600">Cargando tu tablero...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center w-full">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="pt-21 w-full">
        <div className="max-w-6xl mx-auto py-8 px-6">
          <Profile />
          <div className="flex flex-col gap-8">
            <Institutions />

            {/* Sección de Cursos */}
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-500 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">
                    Mis Cursos
                  </h2>
                </div>
                <div className="">
                  {courses.length === 0 ? (
                    <div className="text-center py-8">
                      <p>No hay cursos para mostrar</p>
                    </div>
                  ) : (
                    <>
                      {courses.map((curso) => (
                        <div
                          key={curso.id}
                          className="border border-gray-200 p-5 transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">
                                {curso.name}
                              </h3>
                              <p className="mt-2 text-gray-700">
                                <span className="font-medium">Profesor:</span>{" "}
                                {curso.teacherName}
                              </p>
                            </div>
                            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                              {curso.period}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tablero;
