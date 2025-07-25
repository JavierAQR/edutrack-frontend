import {
  Edit,
  Save,
  X,
  User,
  Award,
  Calendar,
  FileText,
  Link,
} from "lucide-react";
import UserProfile from "../../Components/UserProfile";
import { useEffect, useState } from "react";

interface TeacherInfo {
  specialization: string;
  title: string;
  yearsExperience: number;
  biography: string;
  cvUrl: string;
}

const TeacherProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileData, setProfileData] = useState<TeacherInfo>({
    specialization: "",
    title: "",
    yearsExperience: 0,
    biography: "",
    cvUrl: "",
  });

  const [editData, setEditData] = useState<TeacherInfo>({} as TeacherInfo);

  // Cargar datos del perfil
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/teacher-profile/my-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.ok) {
        const result = await response.json();
        console.log(result);

        if (result.data) {
          setProfileData(result.data);
          setEditData(result.data);
        }
      } else {
        setError("Error al cargar el perfil profesional");
      }
    } catch (err) {
      setError("Error de conexión al cargar el perfil");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof TeacherInfo,
    value: string | number
  ) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // Validaciones básicas
      if (
        !editData.specialization ||
        !editData.title ||
        editData.yearsExperience < 0
      ) {
        setError("Por favor completa todos los campos obligatorios");
        return;
      }

      // Validar URL si se proporciona
      if (editData.cvUrl && !isValidUrl(editData.cvUrl)) {
        setError("Por favor ingresa una URL válida para el CV");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/teacher-profile/update-professional-info",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setProfileData({ ...editData });
        setIsEditing(false);
        setSuccess("Perfil profesional actualizado exitosamente");
      } else {
        setError(result.message || "Error al actualizar el perfil");
      }
    } catch (err) {
      setError("Error de conexión al guardar");
      console.error("Error:", err);
    } finally {
      setSaving(false);
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Gestionar mi perfil</h1>
      <UserProfile />
      <div className="max-w-5xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Información Profesional
                </h2>
              </div>

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Guardando..." : "Guardar"}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* Form */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Especialización */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Award className="h-4 w-4" />
                  <span>Especialización *</span>
                </label>
                <input
                  type="text"
                  value={
                    isEditing
                      ? editData.specialization
                      : profileData.specialization
                  }
                  onChange={(e) =>
                    handleInputChange("specialization", e.target.value)
                  }
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      : "border-gray-200 bg-gray-50"
                  } transition-colors`}
                  placeholder="Ej: Matemáticas, Ciencias, Literatura..."
                />
              </div>

              {/* Título */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Award className="h-4 w-4" />
                  <span>Título Académico *</span>
                </label>
                <input
                  type="text"
                  value={isEditing ? editData.title : profileData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      : "border-gray-200 bg-gray-50"
                  } transition-colors`}
                  placeholder="Ej: Licenciado en Educación..."
                />
              </div>

              {/* Años de experiencia */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4" />
                  <span>Años de Experiencia *</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={
                    isEditing
                      ? editData.yearsExperience
                      : profileData.yearsExperience
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "yearsExperience",
                      parseInt(e.target.value) || 0
                    )
                  }
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      : "border-gray-200 bg-gray-50"
                  } transition-colors`}
                  placeholder="0"
                />
              </div>

              {/* URL del CV */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Link className="h-4 w-4" />
                  <span>URL del CV</span>
                </label>
                <input
                  type="url"
                  value={isEditing ? editData.cvUrl : profileData.cvUrl}
                  onChange={(e) => handleInputChange("cvUrl", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      : "border-gray-200 bg-gray-50"
                  } transition-colors`}
                  placeholder="https://ejemplo.com/mi-cv.pdf"
                />
                {profileData.cvUrl && !isEditing && (
                  <a
                    href={profileData.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <span>Ver CV</span>
                    <Link className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Biografía */}
            <div className="mt-6 space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4" />
                <span>Biografía Profesional</span>
              </label>
              <textarea
                rows={6}
                value={isEditing ? editData.biography : profileData.biography}
                onChange={(e) => handleInputChange("biography", e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg resize-none ${
                  isEditing
                    ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-200 bg-gray-50"
                } transition-colors`}
                placeholder="Describe tu experiencia profesional, metodología de enseñanza, logros académicos..."
              />
              <p className="text-xs text-gray-500">
                Máximo 500 caracteres (
                {(editData.biography || profileData.biography || "").length}
                /500)
              </p>
            </div>

            {/* Campos requeridos note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Nota:</span> Los campos marcados
                con (*) son obligatorios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherProfile;
