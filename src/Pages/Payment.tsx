import { useState } from "react";
import yapeImg from "../assets/yape.png";

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "yape" | "deposit">("card");

  return (
    <div className="h-screen w-screen bg-indigo-400">
      <div className="min-h-screen flex flex-col items-center justify-center ">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-100">Selecciona un método de pago</h1>

        {/* Métodos de pago */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => setSelectedMethod("card")}
            className={`cursor-pointer border rounded-xl p-6 text-center shadow-md hover:shadow-lg transition bg-slate-100 ${
              selectedMethod === "card" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <p className="text-lg font-semibold mb-2">Tarjeta de crédito o débito</p>
            <img
              src="https://img.icons8.com/color/96/000000/bank-card-back-side.png"
              alt="Card"
              className="mx-auto"
            />
          </div>

          <div
            onClick={() => setSelectedMethod("yape")}
            className={`cursor-pointer border rounded-xl p-6 text-center shadow-md hover:shadow-lg transition bg-slate-100 ${
              selectedMethod === "yape" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <p className="text-lg font-semibold mb-2">Yape (QR)</p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Commons_QR_code.png"
              alt="QR"
              className="w-24 h-24 mx-auto"
            />
          </div>

          <div
            onClick={() => setSelectedMethod("deposit")}
            className={`cursor-pointer border rounded-xl p-6 text-center shadow-md hover:shadow-lg transition bg-slate-100 ${
              selectedMethod === "deposit" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <p className="text-lg font-semibold mb-2">Depósito bancario</p>
            <img
              src="https://img.icons8.com/color/96/000000/money-bag.png"
              alt="Depósito"
              className="mx-auto"
            />
          </div>
        </div>

        {/* Contenido según método */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl">
          {selectedMethod === "card" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-blue-600">Pago con tarjeta</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold">Nombre en la tarjeta</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Número de tarjeta</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold">Expira</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">CVV</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      placeholder="123"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Pagar matrícula
                </button>
              </form>
            </>
          )}

          {selectedMethod === "yape" && (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4 text-blue-600">Pago con Yape</h2>
              <img src={yapeImg} alt="QR" className="w-48 h-48 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-4 text-gray-600">Monto a pagar: 600 soles</h4>
              <p className="text-gray-700">Escanea el código con Yape y envía el monto de la matrícula.</p>
              <p className="font-semibold text-gray-800 mt-2">Número: 987 654 321</p>
              <p className="text-sm text-gray-500">Enviar comprobante a pagos@colegiovirtual.edu.pe</p>
            </div>
          )}

          {selectedMethod === "deposit" && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-blue-600">Depósito bancario</h2>
              <p className="mb-2 text-gray-700">
                Puedes hacer el depósito en cualquiera de las siguientes cuentas:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                <li>
                  <strong>BCP:</strong> 123-45678901-0-12
                </li>
                <li>
                  <strong>Interbank:</strong> 345-67890123-4-56
                </li>
                <li>
                  <strong>Titular:</strong> Colegio Virtual EduTrack SAC
                </li>
              </ul>
              <div className="flex justify-center mt-4">
                <button className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition">
                  Ingresa la captura del PAGO
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Enviar el voucher a pagos@colegiovirtual.edu.pe
              </p>
            </div>
          )}
        </div>
      </div>
  
    </div>
  );
};

export default PaymentPage;