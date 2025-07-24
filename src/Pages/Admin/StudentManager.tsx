import axios from "axios";
import { useEffect, useState } from "react";
import StudentForm from "./StudentForm";

interface StudentDTO {
  id: number;
  username: string;
  name: string;
  lastname: string;
  email: string;
  birthdate: string;
  enabled: boolean;
  userType: string;
  gradeId?: number;
  gradeName?: string;
  academicLevel?: string;
}

const StudentManager = () => {
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentDTO | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://edutrack-backend-rw6y.onrender.com/admin/students");
      setStudents(res.data.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar estudiantes", err);
      setError("No se pudieron cargar los estudiantes. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedStudent(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (student: StudentDTO) => {
    setSelectedStudent(student);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm("¿Está seguro de que desea eliminar este estudiante?")
    ) {
      return;
    }

    try {
      await axios.delete(`https://edutrack-backend-rw6y.onrender.com/admin/students/${id}`);
      fetchStudents();
      setSelectedStudent(null);
    } catch (err) {
      console.error("Error al eliminar estudiante", err);
      alert("No se pudo eliminar el estudiante");
    }
  };

  const handleViewProfile = (student: StudentDTO) => {
    setSelectedStudent(student);
  };

  const handleSubmitSuccess = () => {
    setIsModalOpen(false);
    fetchStudents();
  };

  if (loading) {
    return <div className="p-4">Cargando estudiantes...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Estudiantes</h2>
        <button
          onClick={handleCreate}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Crear Nuevo Estudiante
        </button>
      </div>

      {students.length === 0 ? (
        <div className="text-gray-500">No hay estudiantes registrados</div>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Correo</th>
                <th className="px-4 py-2 text-left">Grado/Nivel</th>
                <th className="px-4 py-2 text-center">Estado</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {student.name} {student.lastname}
                  </td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">
                    {student.gradeName || "No asignado"}{" "}
                    {student.academicLevel && `(${student.academicLevel})`}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        student.enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.enabled ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleViewProfile(student)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Modal para formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <StudentForm
              initialData={selectedStudent}
              isEditing={isEditing}
              onSubmit={handleSubmitSuccess}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedStudent(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Vista de perfil */}
      {selectedStudent && !isModalOpen && (
        <div className="mt-6 p-4 bg-white shadow rounded">
          <h3 className="text-xl font-bold mb-2">
            Perfil de {selectedStudent.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <strong>Nombre:</strong> {selectedStudent.name}
              {selectedStudent.lastname}
            </p>
            <p>
              <strong>Usuario:</strong> {selectedStudent.username}
            </p>
            <p>
              <strong>Email:</strong> {selectedStudent.email}
            </p>
            <p>
              <strong>Fecha de nacimiento:</strong> {selectedStudent.birthdate}
            </p>
            <p>
              <strong>Grado:</strong>{" "}
              {selectedStudent.gradeName || "No asignado"}
            </p>
            <p>
              <strong>Nivel académico:</strong>{" "}
              {selectedStudent.academicLevel || "No asignado"}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {selectedStudent.enabled ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManager;
