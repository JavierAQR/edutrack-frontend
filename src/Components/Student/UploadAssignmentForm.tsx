import axios from 'axios';
import React, { useState } from 'react'

interface Props {
    assignmentId: number;
    studentId: number;
    onClose: () => void;
    onSuccess: () => void;
  }

const UploadAssignmentForm = ({ assignmentId, studentId, onSuccess, onClose }: Props) => {
    const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMessage("Selecciona un archivo");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId.toString());
    formData.append("studentId", studentId.toString());
    formData.append("comment", comment);

    try {
      await axios.post("https://edutrack-backend-rw6y.onrender.com/api/submissions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Tarea enviada exitosamente ✅");
      setFile(null);
      setComment("");
      onSuccess(); 
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setMessage("Error al enviar la tarea: " + error.response.data.message);
      } else if (error instanceof Error) {
        setMessage("Error al enviar la tarea: " + error.message);
      } else {
        setMessage("Error al enviar la tarea: Ocurrió un error desconocido");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <textarea
        placeholder="Comentario (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 rounded"
      />
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1 rounded border hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
        >
          Enviar tarea
        </button>
      </div>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </form>
  );
}

export default UploadAssignmentForm