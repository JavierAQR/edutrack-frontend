import { useState, useEffect } from "react";
import axios from "axios";

interface GradeOption {
  id: number;
  name: string;
  academicLevel: string;
  academicLevelId: number;
}

interface AcademicLevel {
  id: number;
  name: string;
}

interface Institution {
  id: number;
  name: string;
}

interface StudentDTO {
  id: number;
  username: string;
  name: string;
  lastname: string;
  email: string;
  birthdate: string;
  enabled: boolean;
  userType: string;
  gradeId?: number;
  gradeName?: string;
  academicLevel?: string;
}

interface StudentFormProps {
  initialData?: StudentDTO | null;
  isEditing: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastname: "",
    email: "",
    birthdate: "",
    password: "",
    enabled: true,
    academicLevel: "",
    academicLevelId: 0,
    gradeId: 0,
    institutionId: 0,
  });

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [availableLevels, setAvailableLevels] = useState<AcademicLevel[]>([]);
  const [availableGrades, setAvailableGrades] = useState<GradeOption[]>([]);

  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar instituciones al montar el componente
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const res = await axios.get(
          "https://edutrack-backend-rw6y.onrender.com/api/institutions/dto"
        );
        setInstitutions(res.data);
        setLoadingInstitutions(false);
      } catch (err) {
        console.error("Error al cargar instituciones", err);
        setLoadingInstitutions(false);
      }
    };

    fetchInstitutions();
  }, []);

  // Cargar datos iniciales cuando se está editando
  useEffect(() => {
    if (initialData && isEditing) {
      const loadInitialData = async () => {
        try {
          // Primero necesitamos obtener los detalles completos del estudiante
          // incluyendo institutionId y academicLevelId
          const studentRes = await axios.get(
            `https://edutrack-backend-rw6y.onrender.com/admin/students/${initialData.id}`
          );
          const studentData = studentRes.data;

          // Cargar niveles de la institución
          if (studentData.institutionId) {
            const levelRes = await axios.get(
              `https://edutrack-backend-rw6y.onrender.com/api/institution-academic-levels/by-institution/${studentData.institutionId}`
            );
            setAvailableLevels(levelRes.data);
          }

          // Cargar grados del nivel
          if (studentData.academicLevelId) {
            const gradeRes = await axios.get(
              `https://edutrack-backend-rw6y.onrender.com/api/grades/by-level/${studentData.academicLevelId}`
            );
            console.log(gradeRes);
            
            setAvailableGrades(gradeRes.data.data);
          }

          // Establecer los datos del formulario
          setFormData({
            username: initialData.username || "",
            name: initialData.name || "",
            lastname: initialData.lastname || "",
            email: initialData.email || "",
            birthdate: initialData.birthdate || "",
            password: "",
            enabled: initialData.enabled ?? true,
            academicLevel: initialData.academicLevel || "",
            academicLevelId: studentData.academicLevelId || 0,
            gradeId: initialData.gradeId || 0,
            institutionId: studentData.institutionId || 0,
          });
        } catch (err) {
          console.error("Error cargando datos iniciales", err);
        }
      };

      loadInitialData();
    }
  }, [initialData, isEditing]);

  // Manejar cambio de institución
  const handleInstitutionChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const institutionId = parseInt(e.target.value);

    setFormData((prev) => ({
      ...prev,
      institutionId,
      academicLevelId: 0,
      academicLevel: "",
      gradeId: 0,
    }));

    if (institutionId) {
      try {
        setLoadingLevels(true);
        const res = await axios.get(
          `https://edutrack-backend-rw6y.onrender.com/api/institution-academic-levels/by-institution/${institutionId}`
        );
        setAvailableLevels(res.data);
        setAvailableGrades([]);
        setLoadingLevels(false);
      } catch (err) {
        console.error("Error cargando niveles académicos", err);
        setAvailableLevels([]);
        setLoadingLevels(false);
      }
    } else {
      setAvailableLevels([]);
      setAvailableGrades([]);
    }
  };

  // Manejar cambio de nivel académico
  const handleLevelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = parseInt(e.target.value);
    const selectedLevel = availableLevels.find((level) => level.id === levelId);

    setFormData((prev) => ({
      ...prev,
      academicLevelId: levelId,
      academicLevel: selectedLevel?.name || "",
      gradeId: 0,
    }));

    if (levelId) {
      try {
        setLoadingGrades(true);
        const res = await axios.get(
          `https://edutrack-backend-rw6y.onrender.com/api/grades/by-level/${levelId}`
        );
        setAvailableGrades(res.data.data);
        setLoadingGrades(false);
      } catch (err) {
        console.error("Error cargando grados", err);
        setAvailableGrades([]);
        setLoadingGrades(false);
      }
    } else {
      setAvailableGrades([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        gradeId: formData.gradeId || null,
        academicLevelId: formData.academicLevelId || null,
        institutionId: formData.institutionId || null,
      };

      if (isEditing && initialData?.id) {
        await axios.put(
          `https://edutrack-backend-rw6y.onrender.com/admin/students/${initialData.id}`,
          payload
        );
      } else {
        await axios.post("https://edutrack-backend-rw6y.onrender.com/admin/students", payload);
      }
      onSubmit();
    } catch (err) {
      console.error("Error al guardar estudiante", err);
      alert("No se pudo guardar el estudiante");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">
        {isEditing ? "Editar Estudiante" : "Crear Nuevo Estudiante"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {!isEditing && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Nombre de usuario
                </label>
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
            <label className="block text-gray-700 mb-2">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          {/* Selector de Institución */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Institución</label>
            <select
              name="institutionId"
              value={formData.institutionId}
              onChange={handleInstitutionChange}
              className="w-full px-3 py-2 border rounded"
              disabled={loadingInstitutions}
              required
            >
              <option value="">Seleccione una institución</option>
              {institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Nivel Académico */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nivel Académico</label>
            <select
              name="academicLevelId"
              value={formData.academicLevelId}
              onChange={handleLevelChange}
              className="w-full px-3 py-2 border rounded"
              disabled={loadingLevels || !formData.institutionId}
              required
            >
              <option value="">Seleccione un nivel académico</option>
              {availableLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Grado */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Grado</label>
            <select
              name="gradeId"
              value={formData.gradeId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              disabled={loadingGrades || !formData.academicLevelId}
              required
            >
              <option value="">Seleccione un grado</option>
              {Array.isArray(availableGrades) && availableGrades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
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
            disabled={
              isSubmitting || !formData.gradeId || !formData.institutionId
            }
          >
            {isSubmitting
              ? "Guardando..."
              : isEditing
              ? "Actualizar Estudiante"
              : "Crear Estudiante"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
