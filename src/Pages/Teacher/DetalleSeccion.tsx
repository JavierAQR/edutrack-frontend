import { useEffect, useState } from "react";
import type {
  StudentInSectionResponse,
  StudentWithAverageResponse,
} from "../../types";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

const DetalleSeccion = () => {
  const { id } = useParams<{ id: string }>();
  const sectionId = Number(id);

  const [students, setStudents] = useState<StudentInSectionResponse[]>([]);
  const [averages, setAverages] = useState<StudentWithAverageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, averagesData] = await Promise.all([
          axios.get(`https://edutrack-backend-rw6y.onrender.com/api/sections/${sectionId}/students`),
          axios.get(
            `https://edutrack-backend-rw6y.onrender.com/api/sections/${sectionId}/students-averages`
          ),
        ]);
        setStudents(studentsData.data);
        setAverages(averagesData.data);
      } catch (error) {
        console.error("Error cargando estudiantes o promedios", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sectionId]);

  const getAverage = (studentId: number): number | null => {
    const found = averages.find((a) => a.studentId === studentId);
    return found ? found.averageGrade : null;
  };

  if (loading) return <p>Cargando datos de la sección...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Estudiantes de la sección</h2>
      {students.length === 0 ? (
        <p>No hay estudiantes en esta sección.</p>
      ) : (
        <>
          <button
            onClick={() => navigate(`/profesor/secciones/${sectionId}/tareas`)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ver Tareas
          </button>
          <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Nombre completo</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Grado</th>
                <th className="text-left px-4 py-2">Nivel</th>
                <th className="text-left px-4 py-2">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="px-4 py-2">
                    {student.name} {student.lastname}
                  </td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">{student.grade}</td>
                  <td className="px-4 py-2">{student.academicLevel}</td>
                  <td className="px-4 py-2">
                    {getAverage(student.id)?.toFixed(2) ?? "Sin promedio"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default DetalleSeccion;
