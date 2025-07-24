import axios from "axios";
import { useEffect, useState } from "react";
import InstitutionGradeManager from "./InstitutionGradeManager";

type Grade = {
  id?: number;
  name: string;
  academicLevelId: number;
  academicLevel?: AcademicLevel;
};

const initialForm: Grade = {
  name: "",
  academicLevelId: 0
};

interface AcademicLevel {
    id: number;
    name: string;
  }

const GradeManager = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [academicLevels, setAcademicLevels] = useState<AcademicLevel[]>([]);
  const [formData, setFormData] = useState<Grade>(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
     const [gradeRes, levelRes] = await Promise.all([
            axios.get("http://localhost:8080/api/grades"),
            axios.get("http://localhost:8080/api/academic-levels"),
      ]);
      setGrades(gradeRes.data.data);
      setAcademicLevels(levelRes.data.data);
      console.log(gradeRes.data.data);
    } catch (error) {
      console.error("Error al obtener grados:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "academicLevelId" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    
    try {
      if (isEditing && editingId !== null) {
        await axios.put(
          `http://localhost:8080/api/grades/${editingId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:8080/api/grades", formData);
      }
      setFormData(initialForm);
      setIsEditing(false);
      setEditingId(null);
      fetchGrades();
    } catch (error) {
      console.error("Error al guardar grado:", error);
    }
  };

  const handleEdit = (grade: Grade) => {
    setFormData(grade);
    setIsEditing(true);
    setEditingId(grade.id!);
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este grado?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8080/api/grades/${id}`);
      fetchGrades();
    } catch (error) {
      console.error("Error al eliminar grado:", error);
    }
  };
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Gestión de Grados</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow p-4 rounded mb-8"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre del Grado (Ej: 1°, 2°, 3°)"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <select
          name="academicLevelId"
          value={formData.academicLevelId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Seleccionar Nivel Académico</option>
          {academicLevels.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className={`bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 ${
            isEditing ? "" : "col-span-2"
          }`}
        >
          {isEditing ? "Actualizar Grado" : "Guardar Grado"}
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

      {/* Tabla */}
      <table className="min-w-full divide-y divide-gray-200 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Nivel Académico
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {grades.map((grade) => (
            <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">{grade.name}</td>
              <td className="px-4 py-3">{grade.academicLevel?.name}</td>
              <td className="flex justify-center px-4 py-3 space-x-2">
                <button
                  onClick={() => handleEdit(grade)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(grade.id!)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <InstitutionGradeManager/>
    </>
  );
};

export default GradeManager;
