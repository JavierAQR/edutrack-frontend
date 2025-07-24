import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import type { AcademicLevel, Grade } from "../../types";

interface StudentProfileData {
  gradeId: string;
  biography: string;
}

const CompleteStudentProfile = () => {
  const [availableLevels, setAvailableLevels] = useState<AcademicLevel[]>([]);
  const [availableGrades, setAvailableGrades] = useState<Grade[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [profileData, setProfileData] = useState<StudentProfileData>({
    gradeId: "",
    biography: "",
  });

  const [selectedLevelId, setSelectedLevelId] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const institutionId = user.institutionId;

        if (institutionId) {
          loadAcademicLevels(institutionId);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
    fetchInstitution();
  }, []);

  const fetchInstitution = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log(user);
        
        const institutionId = user.institutionId;
        
        if (institutionId) {
          const res = await axios.get(`http://localhost:8080/api/institutions/${institutionId}`);
          setSelectedInstitution(res.data.name);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  };

  const loadAcademicLevels = async (institutionId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/institution-academic-levels/by-institution/${institutionId}`
      );
      setAvailableLevels(res.data);
      setAvailableGrades([]);
      setSelectedLevelId("");
      setProfileData((prev) => ({ ...prev, gradeId: "" }));
    } catch (err) {
      console.error("Error cargando niveles:", err);
      setAvailableLevels([]);
    }
  };

  const handleLevelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedLevelId(id);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/grades/by-level/${id}`
      );
      setAvailableGrades(res.data);
      setProfileData((prev) => ({ ...prev, gradeId: "" }));
    } catch (err) {
      console.error("Error cargando grados:", err);
      setAvailableGrades([]);
    }
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setProfileData({ ...profileData, gradeId: id });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: name === "grade" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      console.log(profileData);

      const response = await axios.post(
        "http://localhost:8080/api/student-profile/create",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data.message === "Perfil de estudiante creado exitosamente"
      ) {
        navigate("/estudiante");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al crear el perfil. Por favor, intente más tarde");
      }
      console.error("Error detallado: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-21 px-4 max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-8 my-20">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Completar Perfil de Estudiante
        </h2>
        <p className="text-gray-600 mb-6">
          Para continuar, necesitas completar tu información profesional.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between flex-wrap">
            <div>
              <label
                htmlFor="institution"
                className="block text-sm font-medium text-gray-700"
              >
                Institución
              </label>
              <p>{selectedInstitution}</p>
            </div>
            <div>
              <label
                htmlFor="academicLevel"
                className="block text-sm font-medium text-gray-700"
              >
                Nivel Académico
              </label>
              <select
                value={selectedLevelId}
                onChange={handleLevelChange}
                required
                className="border p-2 rounded mt-1"
              >
                <option value="" disabled>
                  Seleccionar nivel académico
                </option>
                {availableLevels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700"
              >
                Grado
              </label>
              <select
                name="gradeId"
                value={profileData.gradeId}
                onChange={handleGradeChange}
                required
                className="border p-2 rounded mt-1"
              >
                <option value="">Seleccionar grado</option>
                {availableGrades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="biography"
              className="block text-sm font-medium text-gray-700"
            >
              Biografía Estudiantil
            </label>
            <textarea
              id="biography"
              name="biography"
              value={profileData.biography}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe brevemente tu experiencia y enfoque educativo..."
              disabled={isLoading}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Guardando..." : "Completar Perfil"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CompleteStudentProfile;
