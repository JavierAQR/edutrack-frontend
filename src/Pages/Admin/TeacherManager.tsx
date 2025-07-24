import axios from "axios";
import { useEffect, useState } from "react";
import TeacherForm from "./TeacherForm";

interface TeacherDTO {
  id: number;
  username: string;
  name: string;
  lastname: string;
  email: string;
  birthdate: string;
  enabled: boolean;
  userType: string;
  degree: string;
  specialization: string;
  teachingExperience: number;
  biography?: string;
  cvUrl?: string;
}

const TeacherManager = () => {
  const [teachers, setTeachers] = useState<TeacherDTO[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/teachers");
      setTeachers(res.data.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar profesores", err);
      setError("No se pudieron cargar los profesores. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTeacher(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: TeacherDTO) => {
    setSelectedTeacher(teacher);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleViewProfile = (teacher: TeacherDTO) => {
    setSelectedTeacher(teacher);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este profesor?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/teachers/${id}`);
      fetchTeachers();
      setSelectedTeacher(null);
    } catch (err) {
      console.error("Error al eliminar profesor", err);
      alert("No se pudo eliminar el profesor");
    }
  };

  const handleSubmitSuccess = () => {
    setIsModalOpen(false);
    fetchTeachers();
  };

  if (loading) {
    return <div className="p-4">Cargando profesores...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Profesores</h2>
        <button
          onClick={handleCreate}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Crear Nuevo Profesor
        </button>
      </div>

      {/* Modal para formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TeacherForm
              initialData={selectedTeacher}
              isEditing={isEditing}
              onSubmit={handleSubmitSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {teachers.length === 0 ? (
        <div className="text-gray-500">No hay profesores registrados</div>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Correo</th>
                <th className="px-4 py-2 text-left">Especialización</th>
                <th className="px-4 py-2 text-center">Estado</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {teacher.name} {teacher.lastname}
                  </td>
                  <td className="px-4 py-2">{teacher.email}</td>
                  <td className="px-4 py-2">{teacher.specialization}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${teacher.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {teacher.enabled ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(teacher)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleViewProfile(teacher)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedTeacher && !isModalOpen && (
            <div className="mt-6 p-4 bg-white shadow rounded">
              <h3 className="text-xl font-bold mb-2">
                Perfil de {selectedTeacher.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <strong>Nombre:</strong> {selectedTeacher.name}{" "}
                  {selectedTeacher.lastname}
                </p>
                <p>
                  <strong>Usuario:</strong> {selectedTeacher.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedTeacher.email}
                </p>
                <p>
                  <strong>Fecha de nacimiento:</strong> {selectedTeacher.birthdate}
                </p>
                <p>
                  <strong>Especialización:</strong> {selectedTeacher.specialization}
                </p>
                <p>
                  <strong>Título:</strong> {selectedTeacher.degree}
                </p>
                <p>
                  <strong>Experiencia:</strong> {selectedTeacher.teachingExperience}{" "}
                  años
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {selectedTeacher.enabled ? "Activo" : "Inactivo"}
                </p>
                {selectedTeacher.biography && (
                  <p className="col-span-2">
                    <strong>Biografía:</strong> {selectedTeacher.biography}
                  </p>
                )}
                {selectedTeacher.cvUrl && (
                  <p>
                    <strong>CV:</strong>{" "}
                    <a
                      href={selectedTeacher.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver documento
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherManager;
