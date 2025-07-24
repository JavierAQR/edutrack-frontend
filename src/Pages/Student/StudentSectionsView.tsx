import axios from "axios";
import { useEffect, useState } from "react";
import UploadAssignmentForm from "../../Components/Student/UploadAssignmentForm";

interface Assignment {
  assignmentId: number;
  title: string;
  dueDate: string;
  fileUrl: string;
}

interface SectionDashboard {
  sectionId: number;
  sectionName: string;
  courseName: string;
  teacherName: string;
  averageGrade: number;
  submittedAssignments: Assignment[];
  pendingAssignments: Assignment[];
}

const StudentSectionsView = () => {
  const [sections, setSections] = useState<SectionDashboard[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<{
    assignmentId: number;
    sectionName: string;
    assignmentTitle: string;
  } | null>(null);
  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    if (studentId) {
      axios
        .get(
          `http://localhost:8080/api/sections/dashboard/student/${studentId}`
        )
        .then((res) => {
          console.log(res.data);

          setSections(res.data);
        })
        .catch((err) => {
          console.error("Error al obtener las secciones del alumno:", err);
        });
    }
  }, [studentId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Secciones</h1>

      {sections.map((section) => (
        <div
          key={section.sectionId}
          className="border border-gray-300 rounded-lg p-4 mb-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">{section.sectionName}</h2>
          <p className="text-sm text-gray-600">
            Curso: <strong>{section.courseName}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Docente: <strong>{section.teacherName}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Promedio: {section.averageGrade.toFixed(2)}
          </p>

          <div className="mt-4">
            <h3 className="font-semibold text-md">Asignaciones Pendientes:</h3>
            {section.pendingAssignments.length === 0 ? (
              <p className="text-sm text-gray-500">No hay tareas pendientes.</p>
            ) : (
              <ul className="list-disc pl-6">
                {section.pendingAssignments.map((a) => (
                  <li key={a.assignmentId} className="mb-1">
                    <span className="font-medium">{a.title}</span>{" "}
                    <span className="text-sm text-gray-500">
                      (Vence: {a.dueDate})
                    </span>
                    <button
                      className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() =>
                        setSelectedAssignment({
                          assignmentId: a.assignmentId,
                          assignmentTitle: a.title,
                          sectionName: section.sectionName,
                        })
                      }
                    >
                      Entregar
                    </button>
                    <button className="ml-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                      <a
                        href={`http://localhost:8080${a.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white-600 "
                      >
                        Ver archivo
                      </a>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-md">Asignaciones Entregadas:</h3>
            {section.submittedAssignments.length === 0 ? (
              <p className="text-sm text-gray-500">
                No has enviado tareas aún.
              </p>
            ) : (
              <ul className="list-disc pl-6 text-sm">
                {section.submittedAssignments.map((a) => (
                  <div className="flex items-center space-x-2">
                    <li key={a.assignmentId}>{a.title} (Entregado)</li>
                    <button className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                      <a
                        href={`http://localhost:8080${a.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white-600 "
                      >
                        Ver archivo
                      </a>
                    </button>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}

      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              Entregar tarea: {selectedAssignment.assignmentTitle}
            </h2>

            <UploadAssignmentForm
              assignmentId={selectedAssignment.assignmentId}
              studentId={Number(studentId)}
              onClose={() => setSelectedAssignment(null)}
              onSuccess={() => {
                setSelectedAssignment(null);

                if (studentId) {
                  axios
                    .get(
                      `http://localhost:8080/api/sections/dashboard/student/${studentId}`
                    )
                    .then((res) => setSections(res.data));
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSectionsView;
