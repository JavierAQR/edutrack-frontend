import React from 'react';
import serviceImage from '../assets/servicios-tecnologia.jpg'; // Asegúrate de tener esta imagen

const AdditionalServices: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Sección de título principal */}
      <div className="py-6"></div>
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Servicios Adicionales</h1>
        <div className="border-t-2 border-gray-300 w-24 mx-auto my-8"></div>
      </section>

      {/* Sección principal con dos columnas */}
      <section className="flex flex-col md:flex-row gap-12 items-center mb-20">
        {/* Columna izquierda - Imagen */}
        <div className="md:w-1/2">
          <img
            src={serviceImage}
            alt="Cubicol soluciones tecnológicas"
            className="w-full h-auto rounded-lg object-cover shadow-md"
            loading="lazy"
          />
        </div>

        {/* Columna derecha - Texto */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Cubicol más soluciones en tecnología</h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Como consultor de software, Edutrack ofrece también distintos tipos de servicios profesionales 
            relacionados a las tecnologías de información.
          </p>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg transform hover:scale-105 mb-12">
            SOLICITA MÁS SERVICIOS
          </button>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">800</div>
              <div className="text-lg text-gray-700">CENTROS EDUCATIVOS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">14</div>
              <div className="text-lg text-gray-700">AÑOS DE EXPERIENCIA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15</div>
              <div className="text-lg text-gray-700">MÓDULOS INTERACTIVOS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">365</div>
              <div className="text-lg text-gray-700">ATENCIÓN LAS 24/7</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdditionalServices;