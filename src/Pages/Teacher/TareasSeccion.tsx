import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import SubmissionModal from "../../Components/Teacher/SubmissionModal";

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  type: string;
  fileUrl: string;
}

const TareasSeccion = () => {
  const { id } = useParams<{ id: string }>();
  const sectionId = Number(id);
  const teacherId = Number(localStorage.getItem("teacher_id"));

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    number | null
  >(null);
  const [tareas, setTareas] = useState<Assignment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    dueDate: "",
    file: null as File | null,
  });

  const fetchTareas = async () => {
    try {
      const res = await axios.get(
        `https://edutrack-backend-rw6y.onrender.com/api/assignments/section/${sectionId}`
      );
      console.log(res.data);
      
      setTareas(res.data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, [sectionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("type", form.type);
    formData.append("dueDate", form.dueDate);
    formData.append("sectionId", String(sectionId));
    formData.append("teacherId", String(teacherId));
    if (form.file) formData.append("file", form.file);

    try {
      await axios.post("https://edutrack-backend-rw6y.onrender.com/api/assignments", formData);
      setShowModal(false);
      setForm({
        title: "",
        description: "",
        type: "Tarea",
        dueDate: "",
        file: null,
      });
      fetchTareas();
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Material de la Sección</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Crear Material
        </button>
      </div>

      {tareas.length === 0 ? (
        <p>No hay material registrado.</p>
      ) : (
        <ul className="space-y-4">
          {tareas.map((tarea) => (
            <li key={tarea.id} className="bg-white shadow p-4 rounded-xl">
              <h3 className="text-lg font-semibold">{tarea.title}</h3>
              <p>{tarea.description}</p>
              <p>
                <strong>Tipo:</strong> {tarea.type}
              </p>
              <p>
                <strong>Fecha de entrega:</strong> {tarea.dueDate}
              </p>
              <div className="flex space-x-5 items-center">
                {tarea.fileUrl && (
                  <button className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                    <a
                      href={`https://edutrack-backend-rw6y.onrender.com${tarea.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white-600 "
                    >
                      Ver archivo
                    </a>
                  </button>
                )}

                <button
                   onClick={() => {
                    setSelectedAssignmentId(tarea.id);
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Ver material
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedAssignmentId && (
        <SubmissionModal
          assignmentId={selectedAssignmentId}
          onClose={() => setSelectedAssignmentId(null)}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Nuevo Material</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                placeholder="Descripción"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Tipo (Ej: Tarea, examen, material de refuerzo, etc.)"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="file"
                onChange={(e) =>
                  setForm({ ...form, file: e.target.files?.[0] || null })
                }
                className="w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TareasSeccion;
