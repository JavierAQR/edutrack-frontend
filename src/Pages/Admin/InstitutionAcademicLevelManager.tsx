import axios from "axios";
import { useEffect, useState } from "react";

type Institution = {
  id: number;
  name: string;
};

type AcademicLevel = {
  id: number;
  name: string;
};

type InstitutionAcademicLevel = {
  id: number;
  institution: Institution;
  academicLevel: AcademicLevel;
};

const InstitutionAcademicLevelManager = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [academicLevels, setAcademicLevels] = useState<AcademicLevel[]>([]);
  const [relations, setRelations] = useState<InstitutionAcademicLevel[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<
    number | ""
  >("");
  const [selectedLevelId, setSelectedLevelId] = useState<number | "">("");

  useEffect(() => {
    fetchInstitutions();
    fetchAcademicLevels();
    fetchRelations();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/institutions/dto");
      setInstitutions(res.data);
    } catch (err) {
      console.error("Error al cargar instituciones:", err);
    }
  };

  const fetchAcademicLevels = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/academic-levels");
      setAcademicLevels(res.data.data);
    } catch (err) {
      console.error("Error al cargar niveles:", err);
    }
  };

  const fetchRelations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/institution-academic-levels"
      );
      setRelations(res.data);
    } catch (err) {
      console.error("Error al cargar relaciones:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInstitutionId === "" || selectedLevelId === "") {
      alert("Selecciona una institución y un nivel académico");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/institution-academic-levels",
        null,
        {
          params: {
            institutionId: selectedInstitutionId,
            academicLevelId: selectedLevelId,
          },
        }
      );

      setSelectedInstitutionId("");
      setSelectedLevelId("");
      fetchRelations();
    } catch (err) {
      console.error("Error al crear relación:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta relación?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/institution-academic-levels/${id}`
      );
      fetchRelations();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Asignar Niveles Académicos a Instituciones
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-start md:items-end mb-6"
      >
        <select
          value={selectedInstitutionId}
          onChange={(e) => setSelectedInstitutionId(Number(e.target.value))}
          className="border rounded p-2 w-full md:w-auto"
        >
          <option value="">Seleccionar Institución</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>

        <select
          value={selectedLevelId}
          onChange={(e) => setSelectedLevelId(Number(e.target.value))}
          className="border rounded p-2 w-full md:w-auto"
        >
          <option value="">Seleccionar Nivel Académico</option>
          {Array.isArray(academicLevels) &&
            academicLevels.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Asignar
        </button>
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
            <th className="px-4 py-3 text-center text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {relations.map((rel) => (
            <tr
              key={rel.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-4 py-3">{rel.institution.name}</td>
              <td className="px-4 py-3">{rel.academicLevel.name}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleDelete(rel.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {relations.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No hay relaciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InstitutionAcademicLevelManager;
