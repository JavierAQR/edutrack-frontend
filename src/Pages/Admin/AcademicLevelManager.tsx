import axios from "axios";
import { useEffect, useState } from "react";
import InstitutionAcademicLevelManager from "./InstitutionAcademicLevelManager";

type AcademicLevel = {
  id?: number;
  name: string;
};
const initialForm: AcademicLevel = { name: "" };

const AcademicLevelManager = () => {
  const [levels, setLevels] = useState<AcademicLevel[]>([]);
  const [formData, setFormData] = useState<AcademicLevel>(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const res = await axios.get(
        "https://edutrack-backend-rw6y.onrender.com/api/academic-levels"
      );
      console.log(res.data.data);
      
      setLevels(res.data.data);
    } catch (err) {
      console.error("Error al obtener niveles académicos:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingId !== null) {
        await axios.put(
          `https://edutrack-backend-rw6y.onrender.com/api/academic-levels/${editingId}`,
          formData
        );
      } else {
        await axios.post(
          "https://edutrack-backend-rw6y.onrender.com/api/academic-levels",
          formData
        );
      }
      setFormData(initialForm);
      setIsEditing(false);
      setEditingId(null);
      fetchLevels();
    } catch (err) {
      console.error("Error al guardar nivel académico:", err);
    }
  };

  const handleEdit = (level: AcademicLevel) => {
    setFormData(level);
    setIsEditing(true);
    setEditingId(level.id!);
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar este nivel académico?"
    );
    if (!confirm) return;
    try {
      await axios.delete(`https://edutrack-backend-rw6y.onrender.com/api/academic-levels/${id}`);
      fetchLevels();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Gestión de Niveles Académicos</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-start md:items-end mb-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre del nivel (ej. Primaria, Secundaria)"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full md:w-auto flex-1"
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 ${isEditing ? '' : 'col-span-2'}`}
        >
          {isEditing ? "Actualizar" : "Guardar"}
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
            Cancelar
          </button>
        )}
      </form>

      <table className="min-w-full divide-y divide-gray-200 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Nombre
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {Array.isArray(levels) && levels.map((level) => (
            <tr
              key={level.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-4 py-3">{level.name}</td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => handleEdit(level)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(level.id!)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {levels.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center py-4 text-gray-500">
                No hay niveles académicos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <InstitutionAcademicLevelManager/>
    </>
  );
};

export default AcademicLevelManager;
