// src/pages/PagosEstudiante.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface PrecioInstitution {
  id: number;
  tipo: string;
  monto: number;
  anio: number;
}

interface PagoStudent {
  id: number;
  fechaPago: string;
  estadoPago: string;
  precioInstitution: PrecioInstitution;
}

const PagosEstudiante = () => {
  const [pagos, setPagos] = useState<PagoStudent[]>([]);
  const studentId = Number(localStorage.getItem("studentId")); // asegúrate de guardar esto en login

  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`http://localhost:8080/api/pagos/student/${studentId}`)
      .then((res) => setPagos(res.data))
      .catch((err) => console.error("Error cargando pagos:", err));
  }, [studentId]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Mis Pagos</h1>

      {pagos.length === 0 ? (
        <p>No hay pagos registrados.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Monto</th>
              <th className="border p-2">Año</th>
              <th className="border p-2">Fecha de Pago</th>
              <th className="border p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td className="border p-2">{pago.precioInstitution.tipo}</td>
                <td className="border p-2">S/. {pago.precioInstitution.monto}</td>
                <td className="border p-2">{pago.precioInstitution.anio}</td>
                <td className="border p-2">
                  {new Date(pago.fechaPago).toLocaleDateString()}
                </td>
                <td
                  className={`border p-2 ${
                    pago.estadoPago === "pagado" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {pago.estadoPago}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PagosEstudiante;
