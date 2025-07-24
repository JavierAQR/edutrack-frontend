import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const getUserInstitutions = async () => {
  const response = await api.get("/user-institutions/my-institutions");
  return response.data;
};

interface Institution {
    name: string,
    description: string,
}

const Institutions = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await getUserInstitutions();
        setInstitutions(data);
      } catch (error) {
        console.error("Error al obtener instituciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstitutions();
  }, []);

  if (loading)
    return <p className="text-gray-500">Cargando instituciones...</p>;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-500 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">
          Instituciones vinculadas
        </h2>
      </div>
      <>
        {institutions.length === 0 ? (
          <p className="text-gray-600">
            No estás vinculado a ninguna institución.
          </p>
        ) : (
          <ul className="space-y-4">
            {institutions.map((inst, index) => (
              <li key={index} className="bg-white p-5 shadow">
                <h3 className="text-lg font-semibold">{inst.name}</h3>
                <p className="text-gray-600">{inst.description}</p>
              </li>
            ))}
          </ul>
        )}
      </>
    </div>
  );
};

export default Institutions;
