import React from 'react';
import headerImage from '../assets/nosotros-equipo.jpg';

const CubicolPresentation: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            {/* Sección principal con dos columnas */}
            <section className="flex flex-col md:flex-row gap-12 items-center mb-20">
                {/* Columna izquierda - Texto */}
                
                <div className="md:w-1/2">
                 <div className="py-6"></div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        Edutrack es la mejor solución
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
                        Las instituciones educativas
                    </h2>
                    
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12">
                        Nuestro equipo cuenta con más de 14 años de experiencia en software para colegios,
                        facilitando el trabajo de más de 800 clientes que reciben atención inmediata y
                        seguimiento constante de forma personalizada 24/7.
                    </p>
                    
                    <div className="my-14 flex flex-col items-start">
                        <div className="border-t-2 border-gray-300 w-32 mb-8"></div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 md:py-4 md:px-10 rounded-lg text-lg md:text-xl transition-colors shadow-lg transform hover:scale-105">
                            SOLICITA TU DEMO
                        </button>
                    </div>
                </div>

                {/* Columna derecha - Imagen */}
                <div className="md:w-1/2">
                    <img
                        src={headerImage}
                        alt="Edutrack solución educativa"
                        className="w-full h-auto rounded-lg shadow-xl object-cover"
                        loading="lazy"
                    />
                </div>
            </section>

            {/* Segunda sección (full width) */}
            <section className="text-center pt-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                    Edutrack contribuyendo a la educación con tecnología
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Nosotros estamos 100% comprometidos con el avance de la educación con tecnología
                    a beneficio de miles de estudiantes e instituciones educativas que lo necesitan.
                </p>
            </section>
        </div>
    );
};

export default CubicolPresentation;