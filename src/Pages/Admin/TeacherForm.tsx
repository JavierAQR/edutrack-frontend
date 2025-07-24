import { useState, useEffect } from "react";
import axios from "axios";

interface TeacherFormProps {
    initialData: {
        id?: number;
        username?: string;
        name?: string;
        lastname?: string;
        email?: string;
        birthdate?: string;
        enabled?: boolean;
        degree?: string;
        specialization?: string;
        teachingExperience?: number;
        biography?: string;
        cvUrl?: string;
    };
    isEditing: boolean;
    onSubmit: () => void;
    onCancel: () => void;
}

const TeacherForm = ({ initialData, isEditing, onSubmit, onCancel }: TeacherFormProps) => {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        lastname: "",
        email: "",
        birthdate: "",
        password: "",
        enabled: true,
        degree: "",
        specialization: "",
        teachingExperience: 0,
        biography: "",
        cvUrl: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                username: initialData.username || "",
                name: initialData.name || "",
                lastname: initialData.lastname || "",
                email: initialData.email || "",
                birthdate: initialData.birthdate || "",
                password: "",
                enabled: initialData.enabled ?? true,
                degree: initialData.degree || "",
                specialization: initialData.specialization || "",
                teachingExperience: initialData.teachingExperience || 0,
                biography: initialData.biography || "",
                cvUrl: initialData.cvUrl || ""
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (isEditing && initialData?.id) {
                await axios.put(
                    `http://localhost:8080/api/teachers/${initialData.id}`,
                    formData
                );
            } else {
                await axios.post("http://localhost:8080/api/teachers", formData);
            }
            onSubmit();
        } catch (err) {
            console.error("Error al guardar profesor", err);
            alert("No se pudo guardar el profesor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">
                {isEditing ? "Editar Profesor" : "Crear Nuevo Profesor"}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {!isEditing && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nombre de usuario</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded"
                                    required={!isEditing}
                                    minLength={6}
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Apellido</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Fecha de nacimiento</label>
                        <input
                            type="date"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Título</label>
                        <input
                            type="text"
                            name="degree"
                            value={formData.degree}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Especialización</label>
                        <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Años de experiencia</label>
                        <input
                            type="number"
                            name="teachingExperience"
                            value={formData.teachingExperience}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            min="0"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="enabled"
                                checked={formData.enabled}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-gray-700">Activo</span>
                        </label>
                    </div>
                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Biografía</label>
                        <textarea
                            name="biography"
                            value={formData.biography}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            rows={3}
                        />
                    </div>
                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">URL del CV (opcional)</label>
                        <input
                            type="url"
                            name="cvUrl"
                            value={formData.cvUrl}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Profesor" : "Crear Profesor"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeacherForm;
