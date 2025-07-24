import axios from "axios";
import { useEffect, useState } from "react";

interface InstitutionGradeDTO {
  id?: number;
  institutionId: number;
  institutionName?: string;
  academicLevelId: number;
  academicLevelName?: string;
  gradeId: number;
  gradeName?: string;
}

interface Institution {
  id: number;
  name: string;
}

interface AcademicLevel {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  name: string;
}

const initialForm: InstitutionGradeDTO = {
  institutionId: 0,
  academicLevelId: 0,
  gradeId: 0,
};

const InstitutionGradeManager = () => {
  const [institutionGrades, setInstitutionGrades] = useState<
    InstitutionGradeDTO[]
  >([]);
  const [formData, setFormData] = useState<InstitutionGradeDTO>(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [availableLevels, setAvailableLevels] = useState<AcademicLevel[]>([]);
  const [availableGrades, setAvailableGrades] = useState<Grade[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [igRes, instRes] = await Promise.all([
        axios.get("http://localhost:8080/api/institution-grades"),
        axios.get("http://localhost:8080/api/institutions/dto"),
      ]);
      setInstitutionGrades(igRes.data);
      setInstitutions(instRes.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value);

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
      // Reset dependientes si cambia el padre
      ...(name === "institutionId" ? { academicLevelId: 0, gradeId: 0 } : {}),
      ...(name === "academicLevelId" ? { gradeId: 0 } : {}),
    }));

    // Cargar niveles cuando cambia la institución
    if (name === "institutionId") {
      if (!isNaN(parsedValue)) {
        axios
          .get(
            `http://localhost:8080/api/institution-academic-levels/by-institution/${parsedValue}`
          )
          .then((res) => {
            setAvailableLevels(res.data);
          })
          .catch((err) => {
            console.error("Error cargando niveles:", err);
            setAvailableLevels([]);
          });
      }
    }

    // Cargar grados cuando cambia el nivel
    if (name === "academicLevelId") {
      if (!isNaN(parsedValue)) {
        axios
          .get(`http://localhost:8080/api/grades/by-level/${parsedValue}`)
          .then((res) => {
            setAvailableGrades(res.data.data);
          })
          .catch((err) => {
            console.error("Error cargando grados:", err);
            setAvailableGrades([]);
          });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingId !== null) {
        await axios.put(
          `http://localhost:8080/api/institution-grades/${editingId}`,
          formData
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/institution-grades",
          formData
        );
      }
      setFormData(initialForm);
      setIsEditing(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const handleEdit = (data: InstitutionGradeDTO) => {
    setFormData({
      institutionId: data.institutionId,
      academicLevelId: data.academicLevelId,
      gradeId: data.gradeId,
    });
    setEditingId(data.id!);
    setIsEditing(true);

    // Precargar niveles y grados disponibles para edición
    axios
      .get(
        `http://localhost:8080/api/institution-academic-levels/by-institution/${data.institutionId}`
      )
      .then((res) => setAvailableLevels(res.data));

    axios
      .get(
        `http://localhost:8080/api/grades/by-level/${data.academicLevelId}`
      )
      .then((res) => setAvailableGrades(res.data));
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este registro?");
    if (!confirm) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/institution-grades/${id}`
      );
      fetchData();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold mb-4">
        Asignar Grados a Instituciones
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white shadow p-4 rounded mb-8"
      >
        <select
          name="institutionId"
          value={formData.institutionId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Seleccionar Institución</option>
          {institutions.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>

        <select
          name="academicLevelId"
          value={formData.academicLevelId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Seleccionar Nivel Académico</option>
          {availableLevels.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          name="gradeId"
          value={formData.gradeId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Seleccionar Grado</option>
          {availableGrades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className={`bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 ${
            isEditing ? "" : "col-span-3"
          }`}
        >
          {isEditing ? "Actualizar Asignación" : "Guardar Asignación"}
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

      <table className="min-w-full divide-y divide-gray-200 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Institución
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Nivel Académico
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Grado</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {institutionGrades.map((ig) => (
            <tr
              key={ig.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-4 py-3">{ig.institutionName}</td>
              <td className="px-4 py-3">{ig.academicLevelName}</td>
              <td className="px-4 py-3">{ig.gradeName}</td>
              <td className="flex px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => handleEdit(ig)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(ig.id!)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstitutionGradeManager;