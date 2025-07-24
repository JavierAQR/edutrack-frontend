import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import TeacherForm from "./TeacherForm";

interface Teacher {
    id: number;
    username: string;
    name: string;
    lastname: string;
    email: string;
    birthdate: string;
    title: string;
    specialization: string;
    yearsExperience: number;
    biography?: string;
    cvUrl?: string;
    enabled: boolean;
}

const TeacherManager = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Estados para paginación y filtros
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    // Filtrar profesores según criterios
    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher => {
            const matchesSearch =
                teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = selectedStatus === "" ||
                (selectedStatus === "active" && teacher.enabled) ||
                (selectedStatus === "inactive" && !teacher.enabled);

            return matchesSearch && matchesStatus;
        });
    }, [teachers, searchTerm, selectedStatus]);

    // Calcular paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const response = await axios.get(
                "http://localhost:8080/api/institution-admin/teachers",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Asegurarse de que todos los profesores tengan el campo enabled
            const teachersWithStatus = response.data.map((teacher: any) => ({
                ...teacher,
                enabled: teacher.enabled ?? true // Si enabled es null/undefined, establecer a true
            }));

            setTeachers(teachersWithStatus);
            setError(null);
        } catch (err) {
            console.error("Error al cargar profesores", err);
            setError("No se pudieron cargar los profesores. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleCreate = () => {
        setSelectedTeacher(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEdit = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Está seguro de que desea eliminar este profesor?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            await axios.delete(
                `http://localhost:8080/api/institution-admin/teachers/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTeachers();
            setSelectedTeacher(null);
        } catch (err) {
            console.error("Error al eliminar profesor", err);
            alert("No se pudo eliminar el profesor");
        }
    };

    const handleViewProfile = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
    };

    const handleSubmitSuccess = () => {
        setIsModalOpen(false);
        fetchTeachers();
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al cambiar filtro
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al cambiar búsqueda
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        setCurrentPage(1);
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

            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar por nombre, apellido, correo o especialización
                    </label>
                    <input
                        type="text"
                        placeholder="Buscar profesores..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filtrar por estado
                    </label>
                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Todos los estados</option>
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            {filteredTeachers.length === 0 ? (
                <div className="text-gray-500">No se encontraron profesores que coincidan con los filtros</div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Correo
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Especialización
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {teacher.name} {teacher.lastname}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {teacher.email}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {teacher.specialization}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${teacher.enabled
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {teacher.enabled ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2 justify-center">
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                        <div className="text-sm text-gray-700">
                            Mostrando {Math.min(indexOfFirstItem + 1, filteredTeachers.length)} a{" "}
                            {Math.min(indexOfLastItem, filteredTeachers.length)} de{" "}
                            {filteredTeachers.length} profesores
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md ${currentPage === 1
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                            >
                                Anterior
                            </button>

                            <div className="flex gap-1">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-3 py-1 rounded-md ${currentPage === index + 1
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md ${currentPage === totalPages
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Modal para formulario */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg border border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <TeacherForm
                            initialData={selectedTeacher}
                            isEditing={isEditing}
                            onSubmit={handleSubmitSuccess}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setSelectedTeacher(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Vista de perfil */}
            {selectedTeacher && !isModalOpen && (
                <div className="mt-6 p-4 bg-white shadow rounded">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">
                            Perfil de {selectedTeacher.name} {selectedTeacher.lastname}
                        </h3>
                        <button
                            onClick={() => setSelectedTeacher(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p>
                            <strong>Nombre:</strong> {selectedTeacher.name} {selectedTeacher.lastname}
                        </p>
                        <p>
                            <strong>Usuario:</strong> {selectedTeacher.username}
                        </p>
                        <p>
                            <strong>Email:</strong> {selectedTeacher.email}
                        </p>
                        <p>
                            <strong>Fecha de nacimiento:</strong> {new Date(selectedTeacher.birthdate).toLocaleDateString('es-ES')}
                        </p>
                        <p>
                            <strong>Título:</strong> {selectedTeacher.title}
                        </p>
                        <p>
                            <strong>Especialización:</strong> {selectedTeacher.specialization}
                        </p>
                        <p>
                            <strong>Años de experiencia:</strong> {selectedTeacher.yearsExperience}
                        </p>
                        <p>
                            <strong>Estado:</strong>{" "}
                            <span className={`px-2 py-1 rounded-full text-xs ${selectedTeacher.enabled
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}>
                                {selectedTeacher.enabled ? "Activo" : "Inactivo"}
                            </span>
                        </p>
                        {selectedTeacher.cvUrl && (
                            <p>
                                <strong>CV:</strong>{" "}
                                <a
                                    href={selectedTeacher.cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Ver curriculum
                                </a>
                            </p>
                        )}
                        {selectedTeacher.biography && (
                            <div className="md:col-span-2">
                                <strong>Biografía:</strong>
                                <p className="mt-1 whitespace-pre-line">{selectedTeacher.biography}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => {
                                setSelectedTeacher(null);
                                handleEdit(selectedTeacher);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Editar Perfil
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherManager;
