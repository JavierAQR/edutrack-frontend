import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import StudentForm from "./StudentForm";

interface Student {
    id: number;
    username: string;
    name: string;
    lastname: string;
    email: string;
    birthdate: string;
    enabled: boolean;
    gradeId?: number;
    gradeName?: string;
    academicLevelId?: number;
    academicLevel?: string;
    biography?: string;
    hasCompleteProfile?: boolean;
    status?: string;
}

interface AcademicLevel {
    id: number;
    name: string;
}

const StudentManager = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [academicLevels, setAcademicLevels] = useState<AcademicLevel[]>([]);

    // Estados para paginación y filtros
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    // Obtener niveles académicos únicos para el filtro
    const uniqueAcademicLevels = useMemo(() => {
        const levels = new Set<string>();
        students.forEach(student => {
            if (student.academicLevel) {
                levels.add(student.academicLevel);
            }
        });
        return Array.from(levels);
    }, [students]);

    // Filtrar estudiantes según criterios
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch =
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLevel = selectedLevel === "" ||
                (student.academicLevel === selectedLevel);

            const matchesStatus = selectedStatus === "" ||
                (selectedStatus === "active" && student.enabled) ||
                (selectedStatus === "inactive" && !student.enabled);

            return matchesSearch && matchesLevel && matchesStatus;
        });
    }, [students, searchTerm, selectedLevel, selectedStatus]);

    // Calcular paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const response = await axios.get(
                "http://localhost:8080/api/institution-admin/students",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const studentsWithCompleteData = response.data.map((student: any) => ({
                id: student.id,
                username: student.username || "",
                name: student.name || "",
                lastname: student.lastname || "",
                email: student.email || "",
                birthdate: student.birthdate || "",
                enabled: student.enabled ?? true,
                gradeId: student.gradeId || null,
                gradeName: student.gradeName || "",
                academicLevel: student.academicLevel || "",
                biography: student.biography || "",
                hasCompleteProfile: student.hasCompleteProfile || false
            }));

            setStudents(studentsWithCompleteData);
            setError(null);
        } catch (err) {
            console.error("Error al cargar estudiantes", err);
            setError("No se pudieron cargar los estudiantes. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAcademicLevels = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get(
                "http://localhost:8080/api/institution-admin/academic-levels",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAcademicLevels(response.data);
        } catch (err) {
            console.error("Error al cargar niveles académicos", err);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchAcademicLevels();
    }, []);

    const handleCreate = () => {
        setSelectedStudent(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEdit = (student: Student) => {
        setSelectedStudent({
            ...student,
            enabled: student.enabled ?? true
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Está seguro de que desea eliminar este estudiante?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            await axios.delete(
                `http://localhost:8080/api/institution-admin/students/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchStudents();
        } catch (err) {
            console.error("Error al eliminar estudiante", err);
            alert("No se pudo eliminar el estudiante");
        }
    };

    const handleViewProfile = (student: Student) => {
        setSelectedStudent(student);
    };

    const handleSubmitSuccess = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        fetchStudents();
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLevel(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedLevel("");
        setSelectedStatus("");
        setCurrentPage(1);
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

            {/* Filtros y búsqueda */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar por nombre, apellido o correo
                    </label>
                    <input
                        type="text"
                        placeholder="Buscar estudiantes..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filtrar por nivel académico
                    </label>
                    <select
                        value={selectedLevel}
                        onChange={handleLevelChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Todos los niveles</option>
                        {uniqueAcademicLevels.map(level => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
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
            </div>

            <div className="mb-6">
                <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                >
                    Limpiar filtros
                </button>
            </div>

            {filteredStudents.length === 0 ? (
                <div className="text-gray-500">No se encontraron estudiantes que coincidan con los filtros</div>
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
                                        Grado/Nivel
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
                                {currentItems.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {student.name} {student.lastname}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.email}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.gradeName || "No asignado"}{" "}
                                            {student.academicLevel && `(${student.academicLevel})`}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${student.enabled
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {student.enabled ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2 justify-center">
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
                            Mostrando {Math.min(indexOfFirstItem + 1, filteredStudents.length)} a{" "}
                            {Math.min(indexOfLastItem, filteredStudents.length)} de{" "}
                            {filteredStudents.length} estudiantes
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg border border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <StudentForm
                            initialData={selectedStudent}
                            isEditing={isEditing}
                            academicLevels={academicLevels}
                            onSubmit={handleSubmitSuccess}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setSelectedStudent(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {selectedStudent && !isModalOpen && (
                <div className="mt-6 p-4 bg-white shadow rounded">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">
                            Perfil de {selectedStudent.name} {selectedStudent.lastname}
                        </h3>
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p>
                            <strong>Nombre:</strong> {selectedStudent.name} {selectedStudent.lastname}
                        </p>
                        <p>
                            <strong>Usuario:</strong> {selectedStudent.username}
                        </p>
                        <p>
                            <strong>Email:</strong> {selectedStudent.email}
                        </p>
                        <p>
                            <strong>Fecha de nacimiento:</strong>{" "}
                            {new Date(selectedStudent.birthdate).toLocaleDateString("es-ES")}
                        </p>
                        <p>
                            <strong>Grado:</strong> {selectedStudent.gradeName || "No asignado"}
                        </p>
                        <p>
                            <strong>Nivel académico:</strong> {selectedStudent.academicLevel || "No asignado"}
                        </p>
                        <p>
                            <strong>Estado:</strong>{" "}
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${selectedStudent.enabled
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {selectedStudent.enabled ? "Activo" : "Inactivo"}
                            </span>
                        </p>
                        <div className="md:col-span-2">
                            <strong>Biografía:</strong>
                            <p className="mt-1 whitespace-pre-line">
                                {selectedStudent.biography || "No hay biografía disponible"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => handleEdit(selectedStudent)}
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

export default StudentManager;
