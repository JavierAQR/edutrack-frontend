import React, { useState } from 'react';
import Navbar from "../Components/Navbar";


export const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        institution: '',
        option: '',
        phone: '',
        email: '',
        discovery: '',
        query: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your form submission logic here
    };

    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">SIGAMOS EN CONTACTO</h1>
                    <div className="py-6"></div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Mejora tus procesos utilizando la Tecnología Edutrack
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Edutrack, la plataforma intuitiva, práctica, adaptativa.<br />
                        Déjanos tus datos y cambia la forma en cómo gestionas tu institución educativa.
                    </p>
                </div>

                {/* Two Columns Layout */}
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Left Column - Contact Info */}
                    <div className="w-full md:w-1/2 bg-blue-50 p-8 rounded-lg">
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Información de contacto</h3>
                            <div className="space-y-4">
                                <p className="text-gray-700">
                                    <span className="font-semibold block">Envíanos un correo:</span>
                                    <a href="mailto:ventas@edutrack.com.pe" className="text-blue-600 hover:underline">
                                        ventas@edutrack.com.pe
                                    </a>
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold block">Llámanos:</span>
                                    <a href="tel:+51902779069" className="text-blue-600 hover:underline">
                                        +51 902 779 069
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">¿Por qué contactarnos?</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <span className="mr-2 text-blue-500">•</span>
                                    <span>Soporte técnico especializado</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-blue-500">•</span>
                                    <span>Implementación de la plataforma</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-blue-500">•</span>
                                    <span>Consultoría educativa</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-blue-500">•</span>
                                    <span>Capacitaciones personalizadas</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="w-full md:w-1/2">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Realiza tu solicitud</h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre y Apellido *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Institution Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Institución / Empresa *
                                </label>
                                <input
                                    type="text"
                                    name="institution"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Option Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Escoge una opción
                                </label>
                                <select
                                    name="option"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value="consulta">Consulta general</option>
                                    <option value="demo">Solicitar demostración</option>
                                    <option value="soporte">Soporte técnico</option>
                                </select>
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono / Celular *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Discovery Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ¿Cómo nos encontraste?
                                </label>
                                <select
                                    name="discovery"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                >
                                    <option value="">Escoge una opción</option>
                                    <option value="google">Google/Buscador</option>
                                    <option value="redes">Redes sociales</option>
                                    <option value="recomendacion">Recomendación</option>
                                    <option value="evento">Evento o conferencia</option>
                                </select>
                            </div>

                            {/* Query Textarea */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Escriba aquí su consulta...
                                </label>
                                <textarea
                                    name="query"
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg"
                            >
                                ENVIAR
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactForm;