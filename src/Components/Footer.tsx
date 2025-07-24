import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

const Footer = () => {

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white py-12 px-6 md:px-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo y descripción */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2 text-4xl font-semibold"><img src="https://cdn-icons-png.flaticon.com/512/6671/6671494.png" alt="" className="object-cover w-15 h-15"/>Edutrack</div>
            {/* <h2 className="text-2xl font-semibold">Edutrack</h2> */}
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            La plataforma digital intuitiva, práctica, capaz de adaptarse a todas las necesidades y métodos de trabajo de las instituciones educativas.
          </p>
          <div className="mt-4 text-sm space-y-1 underline text-blue-400">
            <a href="#">Políticas de Privacidad</a><br />
            <a href="#">Políticas de Cookies</a>
          </div>
        </div>

        {/* Nuestros Módulos */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Nuestro Módulos</h3>
          <ul className="text-sm space-y-1">
            <li>Módulo Tesorería</li>
            <li>Módulo Académico</li>
            <li>Módulo Intranet</li>
            <li>Módulo Admisión</li>
            <li>Módulo Biblioteca</li>
            <li>Módulo Talleres</li>
          </ul>
        </div>

        {/* Contáctanos */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contáctanos</h3>
          <p className="text-sm mb-2">Email: <a href="mailto:edutrack@gmail.com" className="text-blue-400 underline">edutrack@gmail.com</a></p>
          <p className="text-sm mb-2">Celular: 902 779 069</p>
          <p className="text-sm">Atención: Lun a Vie: 8 am - 6 pm /<br />Sábados: 9 am - 2 pm</p>
        </div>
    </div>
      {/* Botón Scroll to Top */}
      {showButton && (
          <div className="fixed bottom-6 right-6">
          <button onClick={scrollToTop} className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg">
            <IoIosArrowUp/>
          </button>
        </div>
      )}
      
    </footer>
  )
}

export default Footer