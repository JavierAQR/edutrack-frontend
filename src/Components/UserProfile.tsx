import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Save,
  X,
  Edit3,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { UserType } from "../types";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface UserInfo {
  username: string;
  name: string;
  lastname: string;
  email: string;
  birthdate: string;
  userType: UserType;
}

interface Message {
  text: string;
  type: "success" | "error" | "";
}

interface FormErrors {
  username?: string;
  name?: string;
  lastname?: string;
  email?: string;
  birthdate?: string;
  [key: string]: string | undefined;
}

interface ApiResponse {
  message?: string;
  data?: UserInfo[];
  // Agrega otras propiedades que devuelva tu API
}

const UserProfile = () => {
  const { logout } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    name: "",
    lastname: "",
    email: "",
    birthdate: "",
    userType: "",
  });

  const [originalInfo, setOriginalInfo] = useState<UserInfo>({} as UserInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message>({ text: "", type: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  // Cargar información del usuario
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/auth/my-complete-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const personalInfo = data.data.personalInfo;

        const formattedInfo = {
          username: personalInfo.username,
          name: personalInfo.name,
          lastname: personalInfo.lastname,
          email: personalInfo.email,
          birthdate: personalInfo.birthdate,
          userType: personalInfo.userType,
        };

        setUserInfo(formattedInfo);
        setOriginalInfo(formattedInfo);
      } else {
        setMessage({
          text: "Error al cargar la información del usuario",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: "Error de conexión", type: "error" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!userInfo.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    } else if (userInfo.username.length < 3) {
      newErrors.username =
        "El nombre de usuario debe tener al menos 3 caracteres";
    }

    if (!userInfo.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (userInfo.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!userInfo.lastname.trim()) {
      newErrors.lastname = "El apellido es requerido";
    } else if (userInfo.lastname.length < 2) {
      newErrors.lastname = "El apellido debe tener al menos 2 caracteres";
    }

    if (!userInfo.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = "El formato del email no es válido";
    }

    if (!userInfo.birthdate) {
      newErrors.birthdate = "La fecha de nacimiento es requerida";
    } else {
      const birthDate = new Date(userInfo.birthdate);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.birthdate = "La fecha de nacimiento debe ser anterior a hoy";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setMessage({
        text: "Por favor, corrige los errores en el formulario",
        type: "error",
      });
      return;
    }

    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put<ApiResponse>(
        "http://localhost:8080/api/users/update-personal-info",
        {
          username: userInfo.username,
          name: userInfo.name,
          lastname: userInfo.lastname,
          email: userInfo.email,
          birthdate: userInfo.birthdate,
        } as UserInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data;

      if (responseData.data) {
        // Verificar si el username cambió
        const usernameChanged = userInfo.username !== originalInfo.username;

        if (usernameChanged) {


          setMessage({
            text: "Nombre de usuario actualizado. Por favor inicia sesión nuevamente.",
            type: "success",
          });

          setTimeout(() => {
            logout();
          }, 3000);
        } else {
          setMessage({
            text: "Información actualizada exitosamente",
            type: "success",
          });
          setOriginalInfo(userInfo);
          setIsEditing(false);
          setTimeout(() => {
            setMessage({ text: "", type: "" });
          }, 3000);
        }
      } else {
        setMessage({
          text: responseData.message || "Error al actualizar la información",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: "Error de conexión", type: "error" });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUserInfo(originalInfo);
    setIsEditing(false);
    setErrors({});
    setMessage({ text: "", type: "" });
  };

  const getUserTypeDisplay = (userType: UserType): string => {
    const types: Record<UserType, string> = {
      STUDENT: "Estudiante",
      TEACHER: "Profesor",
      PARENT: "Padre/Madre",
      DIRECTOR: "Director",
      ADMIN: "Administrador",
    };
    return types[userType] || userType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando información...</span>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <User className="mr-2 text-blue-600" size={28} />
          Información Personal
        </h2>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 size={16} className="mr-2" />
            Editar
          </button>
        )}
      </div>

      {/* Mensaje de estado */}
      {message.text && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={20} className="mr-2" />
          ) : (
            <AlertCircle size={20} className="mr-2" />
          )}
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Tipo de usuario (solo lectura) */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Usuario
          </label>
          <div className="flex items-center">
            <User size={20} className="text-gray-500 mr-2" />
            <span className="text-gray-800 font-medium">
              {getUserTypeDisplay(userInfo.userType)}
            </span>
          </div>
        </div>

        {/* Nombre de usuario */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre de Usuario *
          </label>
          <input
            id="username"
            type="text"
            value={userInfo.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEditing
                ? "border-gray-300 bg-white"
                : "border-gray-200 bg-gray-50"
            } ${errors.username ? "border-red-500" : ""}`}
            placeholder="Ingresa tu nombre de usuario"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        {/* Nombre y Apellido en una fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombres *
            </label>
            <input
              id="name"
              type="text"
              value={userInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              } ${errors.name ? "border-red-500" : ""}`}
              placeholder="Ingresa tu nombre"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Apellidos *
            </label>
            <input
              id="lastname"
              type="text"
              value={userInfo.lastname}
              onChange={(e) => handleInputChange("lastname", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-50"
              } ${errors.lastname ? "border-red-500" : ""}`}
              placeholder="Ingresa tu apellido"
            />
            {errors.lastname && (
              <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <Mail size={16} className="inline mr-1" />
            Correo Electrónico *
          </label>
          <input
            id="email"
            type="email"
            value={userInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEditing
                ? "border-gray-300 bg-white"
                : "border-gray-200 bg-gray-50"
            } ${errors.email ? "border-red-500" : ""}`}
            placeholder="Ingresa tu correo electrónico"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label
            htmlFor="birthdate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <Calendar size={16} className="inline mr-1" />
            Fecha de Nacimiento *
          </label>
          <input
            id="birthdate"
            type="date"
            value={userInfo.birthdate}
            onChange={(e) => handleInputChange("birthdate", e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEditing
                ? "border-gray-300 bg-white"
                : "border-gray-200 bg-gray-50"
            } ${errors.birthdate ? "border-red-500" : ""}`}
          />
          {errors.birthdate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>
          )}
        </div>

        {/* Botones de acción */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>

            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X size={16} className="mr-2" />
              Cancelar
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserProfile;
