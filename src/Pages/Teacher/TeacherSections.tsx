import { useEffect, useState } from 'react'
import type { Section } from '../../types';
import { useNavigate } from 'react-router';
import axios from 'axios';

const TeacherSections = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    const teacherId = Number(localStorage.getItem('teacher_id'));
  
    useEffect(() => {
      const fetchSections = async () => {
        try {
          const response = await axios.get<Section[]>(`http://localhost:8080/api/sections/by-teacher/${teacherId}`);
          setSections(response.data);
        } catch (error) {
          console.error('Error al obtener las secciones del profesor', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSections();
    }, [teacherId]);
  
    if (loading) return <p>Cargando secciones...</p>;
  
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Mis Secciones</h2>
        {sections.length === 0 ? (
          <p>No tienes secciones asignadas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map(section => (
              <div key={section.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <h3 className="text-xl font-semibold">{section.name}</h3>
                <p><strong>Curso:</strong> {section.courseName}</p>
                <p><strong>Grado:</strong> {section.gradeName}</p>
                <p><strong>Nivel:</strong> {section.academicLevelName}</p>
                <p><strong>Institución:</strong> {section.institutionName}</p>
                <button
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => navigate(`/profesor/secciones/${section.id}`)}
                >
                  Ver sección
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
}

export default TeacherSections