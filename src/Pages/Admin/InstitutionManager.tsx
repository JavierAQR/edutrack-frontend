import axios from "axios";
import { useEffect, useState } from "react";

type Institution = {
  id?: number;
  name: string;
  address?: string;
  description: string;
  phone: string;
  website?: string;
  director?: string;
  academicLevels?: string[];
};

const initialForm: Institution = {
  name: "",
  address: "",
  description: "",
  phone: "",
  website: "",
  director: "",
};

const InstitutionManager = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [formData, setFormData] = useState<Institution>(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ✅ Obtener datos al cargar el componente
  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/institutions/dto"
      );
      setInstitutions(res.data);
    } catch (error) {
      console.error("Error al obtener instituciones:", error);
    }
  };

  // ✅ Manejo de cambios del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      name: formData.name,
      address: formData.address,
      description: formData.description,
      phone: formData.phone,
      website: formData.website,
      director: formData.director
    };

    try {
      if (isEditing && editingId !== null) {
        // Actualizar institución existente

        await axios.put(
          `http://localhost:8080/api/institutions/${editingId}`,
          dataToSend
        );
      } else {
        // Crear nueva institución
        await axios.post(
          "http://localhost:8080/api/institutions",
          dataToSend
        );
      }
      setFormData(initialForm);
      setIsEditing(false);
      setEditingId(null);
      fetchInstitutions();
    } catch (error) {
      console.error("Error al guardar institución:", error);
    }
  };

  const handleEdit = (institution: Institution) => {
    setFormData(institution);
    setIsEditing(true);
    setEditingId(institution.id!);
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar esta institución?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8080/api/institutions/${id}`);
      fetchInstitutions();
    } catch (error) {
      console.error("Error al eliminar institución:", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Gestión de Instituciones</h1>

      {/* 📝 Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow p-4 rounded mb-8"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="website"
          placeholder="Sitio web"
          value={formData.website}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="director"
          placeholder="Director"
          value={formData.director}
          onChange={handleChange}
          className="border p-2 rounded col-span-full"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-full"
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 ${isEditing ? "" : "col-span-2"
            }`}
        >
          {isEditing ? "Actualizar Institución" : "Guardar Institución"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setFormData(initialForm);
              setIsEditing(false);
              setEditingId(null);
            }}
            className="bg-gray-600 text-white rounded px-4 py-2 hover:bg-gray-700"
          >
            Cancelar edición
          </button>
        )}
      </form>

      {/* 📋 Tabla */}
      <table className="min-w-full divide-y divide-gray-200 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Dirección
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Teléfono
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Descripción
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Sitio web
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Director
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Niveles Académicos
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {institutions.map((inst) => (
            <tr
              key={inst.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-4 py-3">{inst.name}</td>
              <td className="px-4 py-3">{inst.address || "-"}</td>
              <td className="px-4 py-3">{inst.phone}</td>
              <td className="px-4 py-3">{inst.description}</td>
              <td className="px-4 py-3">{inst.website || "-"}</td>
              <td className="px-4 py-3">
                {inst.academicLevels?.join(",") || "No asignado"}
              </td>
              <td className="flex px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => handleEdit(inst)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(inst.id!)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default InstitutionManager;
