import axios from "axios";
import { useEffect, useState } from "react";
interface Submission {
  submissionId: number;
  studentName: string;
  fileUrl: string;
  comment?: string;
  grade?: number | null;
}

interface SubmissionsModalProps {
  assignmentId: number;
  onClose: () => void;
}
const SubmissionModal = ({ assignmentId, onClose }: SubmissionsModalProps) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<{ [key: number]: number | "" }>({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `https://edutrack-backend-rw6y.onrender.com/api/submissions/assignment/${assignmentId}`
        );
        setSubmissions(res.data);
        console.log(res.data);

        // Inicializar grading con notas actuales o vacías
        const initialGrades: { [key: number]: number | "" } = {};
        res.data.forEach((s: Submission) => {
          initialGrades[s.submissionId] = s.grade ?? "";
        });
        setGrading(initialGrades);
      } catch (error) {
        console.error("Error cargando entregas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId]);

  const handleGradeChange = (submissionId: number, value: string) => {
    const num = value === "" ? "" : Number(value);
    if (num === "" || (!isNaN(num) && num >= 0 && num <= 20)) {
      setGrading((prev) => ({ ...prev, [submissionId]: num }));
    }
  };

  const saveGrade = async (submissionId: number) => {
    const grade = grading[submissionId];
    if (grade === "" || grade === null) {
      alert("Ingrese una calificación válida");
      return;
    }
    try {
      await axios.put(
        `https://edutrack-backend-rw6y.onrender.com/api/submissions/${submissionId}/grade`,
        null,
        { params: { grade } }
      );
      alert("Calificación guardada");
    } catch (error) {
      console.error("Error guardando calificación", error);
      alert("Error guardando calificación");
    }
  };

  if (loading) return <p>Cargando entregas...</p>;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold mb-4">Entregas de la tarea</h3>
          <button
            onClick={onClose}
            className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>

        {submissions.length === 0 ? (
          <p>No hay entregas aún.</p>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Estudiante</th>
                <th className="border px-2 py-1">Archivo</th>
                <th className="border px-2 py-1">Comentario</th>
                <th className="border px-2 py-1">Calificación</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.submissionId} className="border-t">
                  <td className="border px-2 py-1">{submission.studentName}</td>
                  <td className="border px-2 py-1">
                    <a
                      href={`https://edutrack-backend-rw6y.onrender.com${submission.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver archivo
                    </a>
                  </td>
                  <td className="border px-2 py-1">
                    {submission.comment || "-"}
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={grading[submission.submissionId]}
                      onChange={(e) =>
                        handleGradeChange(
                          submission.submissionId,
                          e.target.value
                        )
                      }
                      className="w-16 border px-1 py-0.5 rounded text-center"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => saveGrade(submission.submissionId)}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Guardar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SubmissionModal;
