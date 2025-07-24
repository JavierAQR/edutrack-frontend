import React, { useEffect, useState } from 'react';

type Payment = {
  id: number;
  userId: number;
  amount: number;
  paymentDate: string;
  status: string;
};

const PaymentsTable: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://edutrack-backend-rw6y.onrender.com/api/payments')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar pagos');
        return res.json();
      })
      .then(data => {
        setPayments(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-8">Cargando pagos...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="container mx-auto px-4 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Pagos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300">ID</th>
              <th className="py-2 px-4 border-b border-gray-300">User ID</th>
              <th className="py-2 px-4 border-b border-gray-300">Monto</th>
              <th className="py-2 px-4 border-b border-gray-300">Fecha de Pago</th>
              <th className="py-2 px-4 border-b border-gray-300">Estado</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(pago => (
              <tr key={pago.id} className="text-center hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-gray-300">{pago.id}</td>
                <td className="py-2 px-4 border-b border-gray-300">{pago.userId}</td>
                <td className="py-2 px-4 border-b border-gray-300">{pago.amount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b border-gray-300">{new Date(pago.paymentDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b border-gray-300">{pago.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTable;
