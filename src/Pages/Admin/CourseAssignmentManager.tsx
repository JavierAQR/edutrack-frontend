import { useEffect, useState } from "react";
import axios from "axios";
import type { AcademicLevel, Grade, Institution } from "../../types";

interface CourseDTO {
  id?: number;
  name: string;
  gradeId: number;
  gradeName?: string;
  academicLevelId?: number;
  academicLevelName?: string;
  institutionId?: number;
  institutionName?: string;
}

const initialForm: CourseDTO = {
  name: "",
  gradeId: 0,
};

const CourseManager = () => {
  const [formData, setFormData] = useState<CourseDTO>(initialForm);
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  const [availableLevels, setAvailableLevels] = useState<AcademicLevel[]>([]);
  const [availableGrades, setAvailableGrades] = useState<Grade[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAll();
    
  }, []);

  const fetchAll = async () => {
    try {
      const [courseRes, gradeRes, instRes] = await Promise.all([
        axios.get("http://localhost:8080/api/courses"),
        axios.get("http://localhost:8080/api/grades"),
        axios.get("http://localhost:8080/api/institutions/dto"),
      ]);
      setCourses(courseRes.data);
      setGrades(gradeRes.data.data);
      setInstitutions(instRes.data);
      console.log(courseRes.data);
    } catch (err) {
      console.error("Error cargando datos", err);
    }
  };

  const handleInstitutionChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = parseInt(e.target.value);

    setFormData({
      ...formData,
      institutionId: id,
      academicLevelId: undefined,
      gradeId: 0,
    });

    try {
      const res = await axios.get(
        `http://localhost:8080/api/institution-academic-levels/by-institution/${id}`
      );
      setAvailableLevels(res.data);
      setAvailableGrades([]);

    } catch (err) {
      console.error("Error cargando niveles:", err);
      setAvailableLevels([]);
    }
  };

  const handleLevelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);

    setFormData({ ...formData, academicLevelId: id, gradeId: 0 });

    try {
      const res = await axios.get(
        `http://localhost:8080/api/grades/by-level/${id}`
      );
      setAvailableGrades(res.data.data);
    } catch (err) {
      console.error("Error cargando grados:", err);
      setAvailableGrades([]);
    }
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setFormData({ ...formData, gradeId: id });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingId !== null) {
        await axios.put(
          `http://localhost:8080/api/courses/${editingId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:8080/api/courses", formData);
      }
      setFormData(initialForm);
      setIsEditing(false);
      setEditingId(null);
      fetchAll();
    } catch (err) {
      console.error("Error al guardar", err);
    }
  };

  const handleEdit = async (course: CourseDTO) => {
    
    const selectedGrade = grades.find((g) => g.id === course.gradeId);   
    const levelId =
      course.academicLevelId || selectedGrade?.academicLevelId || 0;
    const institutionId = course.institutionId || 0;    
  
    try {
      // Cargar niveles de la institución
      const levelRes = await axios.get(
        `http://localhost:8080/api/institution-academic-levels/by-institution/${institutionId}`
      );
      
      setAvailableLevels(levelRes.data);
  
      // Cargar grados del nivel
      const gradeRes = await axios.get(
        `http://localhost:8080/api/grades/by-level/${levelId}`
      );
      setAvailableGrades(gradeRes.data.data);
  
      // Luego de que ya se han cargado, actualizamos el formData
      setFormData({
        id: course.id,
        name: course.name,
        gradeId: course.gradeId,
        academicLevelId: levelId,
        institutionId: institutionId,
      });
      console.log(formData);
      
  
      setEditingId(course.id!);
      setIsEditing(true);
    } catch (err) {
      console.error("Error cargando datos en edición", err);
      setAvailableLevels([]);
      setAvailableGrades([]);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este curso?")) {
      await axios.delete(`http://localhost:8080/api/courses/${id}`);
      fetchAll();
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Gestión de Asignaturas</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white shadow p-4 rounded mb-8"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre del curso"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <select
          value={formData.institutionId || ""}
          onChange={handleInstitutionChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Seleccionar institución</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>

        <select
          value={formData.academicLevelId || ""}
          onChange={handleLevelChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Seleccionar nivel académico</option>
          {availableLevels.map((lvl) => (
            <option key={lvl.id} value={lvl.id}>
              {lvl.name}
            </option>
          ))}
        </select>

        <select
          name="gradeId"
          value={formData.gradeId}
          onChange={handleGradeChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Seleccionar grado</option>
          {availableGrades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="col-span-1 md:col-span-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isEditing ? "Actualizar curso" : "Guardar curso"}
        </button>
      </form>

      <table className="min-w-full divide-y divide-gray-200 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Curso</th>
            <th className="px-4 py-2 text-left">Grado</th>
            <th className="px-4 py-2 text-left">Nivel Académico</th>
            <th className="px-4 py-2 text-left">Institución</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {courses.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2">{c.gradeName}</td>
              <td className="px-4 py-2">{c.academicLevelName}</td>
              <td className="px-4 py-2">{c.institutionName}</td>
              <td className="px-4 py-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(c.id!)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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

export default CourseManager;
