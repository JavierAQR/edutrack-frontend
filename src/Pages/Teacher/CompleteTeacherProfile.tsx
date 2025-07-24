import axios from "axios";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

interface TeacherProfileData {
  specialization: string;
  title: string;
  yearsExperience: number;
  biography: string;
  cvUrl: string;
}

const CompleteTeacherProfile = () => {
  const [profileData, setProfileData] = useState<TeacherProfileData>({
    specialization: "",
    title: "",
    yearsExperience: 0,
    biography: "",
    cvUrl: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: name === "yearsExperience" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://edutrack-backend-rw6y.onrender.com/api/teacher-profile/create",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Perfil de profesor creado exitosamente") {
        // Redirigir al dashboard del profesor
        navigate("/profesor");
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
          Completar Perfil de Profesor
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
          <div>
            <label
              htmlFor="specialization"
              className="block text-sm font-medium text-gray-700"
            >
              Especialización *
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={profileData.specialization}
              onChange={handleInputChange}
              required
              placeholder="Ej: Matemáticas, Historia, Ciencias..."
              disabled={isLoading}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Título Profesional *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={profileData.title}
              onChange={handleInputChange}
              required
              placeholder="Ej: Licenciado en Matemáticas"
              disabled={isLoading}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="yearsExperience"
              className="block text-sm font-medium text-gray-700"
            >
              Años de Experiencia *
            </label>
            <input
              type="number"
              id="yearsExperience"
              name="yearsExperience"
              value={profileData.yearsExperience}
              onChange={handleInputChange}
              required
              min="0"
              max="50"
              disabled={isLoading}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="cvUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Enlace a CV
            </label>
            <input
              type="text"
              id="cvUrl"
              name="cvUrl"
              value={profileData.cvUrl}
              onChange={handleInputChange}
              required
              placeholder="Ej: https://MiCV.com"
              disabled={isLoading}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="biography"
              className="block text-sm font-medium text-gray-700"
            >
              Biografía Profesional
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

export default CompleteTeacherProfile;
