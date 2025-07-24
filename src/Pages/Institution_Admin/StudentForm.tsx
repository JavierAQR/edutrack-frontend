import { useState, useEffect } from "react";
import axios from "axios";

interface StudentFormProps {
    initialData?: any;
    isEditing: boolean;
    academicLevels: any[];
    onSubmit: () => void;
    onCancel: () => void;
}

const StudentForm = ({ initialData, isEditing, academicLevels = [], onSubmit, onCancel }: StudentFormProps) => {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        lastname: "",
        email: "",
        password: "",
        birthdate: "",
        academicLevelId: "",
        gradeId: "",
        biography: "",
        enabled: "true"
    });

    const [grades, setGrades] = useState<any[]>([]);
    const [loadingGrades, setLoadingGrades] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
        } catch {
            return dateString.split("T")[0] || "";
        }
    };

    useEffect(() => {
        const fetchGrades = async () => {
            if (!formData.academicLevelId) {
                setGrades([]);
                return;
            }

            try {
                setLoadingGrades(true);
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get(
                    `http://localhost:8080/api/institution-admin/grades-by-level/${formData.academicLevelId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setGrades(response.data);
            } catch (err) {
                console.error("Error al cargar grados", err);
                setGrades([]);
            } finally {
                setLoadingGrades(false);
            }
        };

        fetchGrades();
    }, [formData.academicLevelId]);

    useEffect(() => {
        if (initialData && !initialLoadComplete) {
            const loadInitialData = async () => {
                try {
                    if (isEditing && initialData.id) {
                        const token = localStorage.getItem("token");
                        if (token) {
                            const detailResponse = await axios.get(
                                `http://localhost:8080/api/institution-admin/students/${initialData.id}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            initialData = {
                                ...initialData,
                                ...detailResponse.data
                            };
                        }
                    }

                    const newFormData = {
                        username: initialData.username || "",
                        name: initialData.name || "",
                        lastname: initialData.lastname || "",
                        email: initialData.email || "",
                        password: "",
                        birthdate: formatDate(initialData.birthdate),
                        academicLevelId: initialData.academicLevelId?.toString() || "",
                        gradeId: initialData.gradeId?.toString() || "",
                        biography: initialData.biography || "",
                        enabled: initialData.enabled !== undefined ? initialData.enabled.toString() : "true"
                    };

                    setFormData(newFormData);
                    setInitialLoadComplete(true);
                } catch (error) {
                    console.error("Error al cargar datos iniciales:", error);
                }
            };

            loadInitialData();
        } else if (!initialData) {
            setInitialLoadComplete(true);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === "academicLevelId" ? { gradeId: "" } : {})
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const dataToSend = {
                username: formData.username,
                name: formData.name,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
                birthdate: formData.birthdate,
                academicLevelId: formData.academicLevelId ? parseInt(formData.academicLevelId) : null,
                gradeId: formData.gradeId ? parseInt(formData.gradeId) : null,
                biography: formData.biography, // Asegurar que se envía la biografía
                enabled: formData.enabled === "true"
            };

            const url = isEditing && initialData?.id
                ? `http://localhost:8080/api/institution-admin/students/${initialData.id}`
                : "http://localhost:8080/api/institution-admin/students";

            const method = isEditing && initialData?.id ? "PUT" : "POST";

            await axios({
                method,
                url,
                data: dataToSend,
                headers: { Authorization: `Bearer ${token}` }
            });

            onSubmit();
        } catch (err) {
            console.error("Error submitting form:", err);
            alert("Error al guardar los datos del estudiante");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {isEditing ? "Editar Estudiante" : "Crear Nuevo Estudiante"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    {isEditing ? "Actualiza la información del estudiante" : "Completa los datos del nuevo estudiante"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isEditing}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {!isEditing && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            minLength={6}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                    <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nivel Académico</label>
                    <select
                        name="academicLevelId"
                        value={formData.academicLevelId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Seleccione un nivel académico</option>
                        {academicLevels.map(level => (
                            <option key={level.id} value={level.id.toString()}>
                                {level.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grado</label>
                    {loadingGrades ? (
                        <div className="animate-pulse bg-gray-200 rounded-md h-10 w-full"></div>
                    ) : (
                        <select
                            name="gradeId"
                            value={formData.gradeId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={!formData.academicLevelId || loadingGrades}
                        >
                            <option value="">Seleccione un grado</option>
                            {grades.map(grade => (
                                <option key={grade.id} value={grade.id.toString()}>
                                    {grade.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                        name="enabled"
                        value={formData.enabled}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
                    <textarea
                        name="biography"
                        value={formData.biography}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe los intereses y habilidades del estudiante..."
                    />
                    {formData.biography && (
                        <p className="mt-1 text-sm text-gray-500">
                            {formData.biography.length}/500 caracteres
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isEditing ? "Actualizar Estudiante" : "Crear Estudiante"}
                </button>
            </div>
        </form>
    );
};

export default StudentForm;
