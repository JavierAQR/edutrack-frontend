import axios from "axios";
import { useCallback, useEffect, useState, useMemo } from "react";
import CourseForm from "./CourseForm";
import { toast } from "react-toastify";

interface Course {
    id: number;
    name: string;
    gradeId: number;
    gradeName: string;
    academicLevelId: number;
    academicLevelName: string;
}

interface Grade {
    id: number;
    name: string;
    academicLevelId: number;
    academicLevelName: string;
}

const CourseManager = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Estados para paginación y filtros
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");

    // Obtener niveles académicos únicos
    const academicLevels = useMemo(() => {
        const levels = new Set<string>();
        courses.forEach(course => levels.add(course.academicLevelName));
        return Array.from(levels);
    }, [courses]);

    // Filtrar cursos según criterios
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = selectedLevel === "" || course.academicLevelName === selectedLevel;
            return matchesSearch && matchesLevel;
        });
    }, [courses, searchTerm, selectedLevel]);

    // Calcular paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await axios.get<Course[]>(
                `http://localhost:8080/api/institution-admin/courses`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCourses(response.data);
        } catch (err) {
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.message || "Error al cargar los cursos"
                : "Error al cargar los cursos";
            setError(errorMessage);
            console.error("Error fetching courses:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchGrades = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get<Grade[]>(
                `http://localhost:8080/api/institution-admin/courses/grades`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setGrades(response.data);
        } catch (err) {
            console.error("Error al cargar los grados:", err);
            toast.error("Error al cargar los grados disponibles");
        }
    }, []);

    const handleCreate = () => {
        setShowForm(true);
        setEditingCourse(undefined);
    };

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("No se encontró el token de autenticación");
                    return;
                }

                await axios.delete(
                    `http://localhost:8080/api/institution-admin/courses/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success("Curso eliminado correctamente");
                fetchCourses();
            } catch (err) {
                const errorMessage = axios.isAxiosError(err)
                    ? err.response?.data?.message || "Error al eliminar el curso"
                    : "Error al eliminar el curso";
                toast.error(errorMessage);
                console.error(err);
            }
        }
    };

    const handleSubmit = async (formData: { name: string; gradeId: string }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No se encontró el token de autenticación");
                return;
            }

            if (editingCourse) {
                await axios.put(
                    `http://localhost:8080/api/institution-admin/courses/${editingCourse.id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success("Curso actualizado correctamente");
            } else {
                await axios.post(
                    "http://localhost:8080/api/institution-admin/courses",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success("Curso creado correctamente");
            }
            setShowForm(false);
            fetchCourses();
        } catch (err) {
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.message || "Error al guardar el curso"
                : "Error al guardar el curso";
            toast.error(errorMessage);
            console.error(err);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLevel(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al cambiar filtro
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al cambiar búsqueda
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedLevel("");
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchCourses();
        fetchGrades();
    }, [fetchCourses, fetchGrades]);

    if (loading) return <div className="p-6">Cargando cursos...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Gestión de Cursos</h1>
                <button
                    onClick={handleCreate}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                    Agregar Curso
                </button>
            </div>

            <div className="mb-4">
                {/* Filtros y búsqueda */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar por nombre
                        </label>
                        <input
                            type="text"
                            placeholder="Buscar cursos..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por nivel académico
                        </label>
                        <select
                            value={selectedLevel}
                            onChange={handleLevelChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos los niveles</option>
                            {academicLevels.map(level => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
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
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Nivel Académico
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Grado
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    {filteredCourses.length === 0
                                        ? "No se encontraron cursos que coincidan con los filtros"
                                        : "Cargando cursos..."}
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {course.name}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.academicLevelName}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.gradeName}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleEdit(course)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                <div className="text-sm text-gray-700">
                    Mostrando {Math.min(indexOfFirstItem + 1, filteredCourses.length)} a{" "}
                    {Math.min(indexOfLastItem, filteredCourses.length)} de{" "}
                    {filteredCourses.length} cursos
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

            {showForm && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg border border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CourseForm
                            course={editingCourse}
                            grades={grades}
                            onSubmit={handleSubmit}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManager;
