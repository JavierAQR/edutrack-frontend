import { useEffect, useState } from "react";
import type { Section, Student } from "../../../types";

interface Props {
    section: Section | null;
    students: Student[];
    assignedStudentIds: number[];
    onClose: () => void;
    onSave: (studentIds: number[]) => void;
  }

export default function AssignStudentsModal({
    section,
    students,
    assignedStudentIds,
    onClose,
    onSave,
  }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
    const handleToggle = (id: number) => {
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
      };

    useEffect(() => {
        setSelectedIds(assignedStudentIds); // inicializa los checks
      }, [assignedStudentIds]);
  
    return (
      <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Asignar Alumnos</h2>
  
          <div className="mb-4">
            <p><strong>Nombre de Sección:</strong> {section?.name}</p>
            <p><strong>Nivel Académico:</strong> {section?.academicLevelName}</p>
            <p><strong>Grado:</strong> {section?.gradeName}</p>
            <p><strong>Curso:</strong> {section?.courseName}</p>
            <p><strong>Profesor:</strong> {section?.teacherFullName}</p>
          </div>
  
          <div className="max-h-60 overflow-y-auto border rounded p-3 mb-4">
            {students.map((student) => (
              <label key={student.id} className="block mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  value={student.id}
                  checked={selectedIds.includes(student.id)}
                  onChange={() => handleToggle(student.id)}
                  className="mr-2"
                />
                {student.name} {student.lastName}
              </label>
            ))}
          </div>
  
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(selectedIds)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    );
  }
