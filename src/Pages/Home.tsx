import { Swiper, SwiperSlide } from "swiper/react";
import Navbar from "../Components/Navbar";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Importaciones CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { FaArrowAltCircleUp, FaCoins, FaGraduationCap, FaHeadset, FaLaptop, FaUsers } from "react-icons/fa";
import type { ReactNode } from "react";

const Home = () => {
  return (
    <>
      <Navbar />
      <Swiper
        spaceBetween={10}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        style={{
          '--swiper-navigation-color': '#F6EAF9',
          '--swiper-pagination-color': '#F6EAF9',
        } as React.CSSProperties}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="relative h-165 text-white">
            <div className="absolute h-full w-full bottom-0 mt-40 flex items-end justify-center">
              <div className="bg-transparent h-[300px] w-full mb-15 px-6">
                {/* Titulo principal */}
                <div className="max-w-5xl mx-auto">
                  <h1 className="text-3xl md:text-5xl font-bold mb-10 max-w-150">
                    La plataforma número 1 en Gestión Educativa
                  </h1>

                  {/* Descripción */}
                  <div className="max-w-2xl mb-8 flex ">
                    <div className="flex text-lg gap-4">
                      <div className="bg-cyan-400 h-full w-5"></div>
                      ¡Sé parte de una nueva experiencia en gestión educativa!
                      Edutrack ofrece una interfaz intuitiva, práctica y de fácil uso, capaz
                      de adaptarse a todas las necesidades y métodos de trabajo de
                      las instituciones educativas.
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <img
              src="https://www.cubicol.pe/public/img/banner/1.jpg"
              alt=""
              className="w-full h-full object-cover object-top"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-165 text-white">
            <div className="absolute h-full w-full bottom-0 mt-40 flex items-end justify-center">
              <div className="bg-transparent h-[300px] w-full mb-15 px-6">
                {/* Titulo principal */}
                <div className="max-w-5xl mx-auto">
                  <h1 className="text-3xl md:text-5xl font-bold mb-10 max-w-130">
                    Conoce nuestra Agencia Publicitaria
                  </h1>

                  {/* Descripción */}
                  <div className="max-w-2xl mb-8 flex ">
                    <div className="flex text-lg gap-4">
                      <div className="bg-cyan-400 h-full w-5"></div>
                      ¿Necesitas actualizar tu web, diseños o algún video?
                      Edutrack Agencia te ofrece diferentes servicios para
                      potenciar tu negocio en el mundo digital, así como manejar
                      tus redes sociales.
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <img
              src="https://www.cubicol.pe/public/img/banner/2.jpg"
              alt=""
              className="w-full h-full object-cover object-top-right"
            />
          </div>
        </SwiperSlide>
      </Swiper>
      <main className="bg-white">
        {/* Contenedor principal */}
        <div className="flex justify center py-40 px-2">
          <article className="max-w-5xl mx-auto flex max-md:flex-col">
            {/* Sección de texto */}
            <section className="lg:w-1/2 mb-10 lg:mb-0">
              <div className="flex gap-2 h-[3px] bg-white mb-5">
                <div className="h-full w-3 bg-blue-600"></div>
                <div className="h-full w-10 bg-blue-600"></div>
                <div className="h-full w-3 bg-blue-600"></div>
              </div>
              {/* Título */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                ¿Qué es Edutrack?
              </h1>

              {/* Primer párrafo */}
              <p className="text-xl text-gray-600 mb-6">
                Edutrack es la plataforma ideal que comunica a padres de familia,
                estudiantes, docentes y directivos, con la más alta tecnología.
              </p>

              {/* Segundo párrafo */}
              <p className="text-xl text-gray-600 mb-8">
                Accede a una nueva experiencia en gestión educativa con nuestra
                Aula Virtual, generando Calificaciones, Tareas, Control de
                Asistencia, Certificado de estudios, Admisión, Pensiones y mucho
                más desde la web.
              </p>
            </section>

            {/* Sección de imagen (placeholder) */}
            <section className="lg:w-1/2 lg:pl-12">
              <img
                src="https://www.cubicol.pe/public/img/web/bienvenido.png"
                alt="Plataforma educativa"
                className="w-full h-auto object-cover"
              />
            </section>
          </article>
        </div>

        <article className="bg-[#F4F6FD] py-16 text-center">
          <div className="flex justify-center gap-2 h-[3px] mb-5">
            <div className="h-full w-3 bg-blue-600"></div>
            <div className="h-full w-10 bg-blue-600"></div>
            <div className="h-full w-3 bg-blue-600"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#292562] mb-2">
            ¿Por qué elegir nuestro sistema?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-xl">
            Con Edutrack lograrás administrar de manera más eficiente tu
            información.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-6 max-w-6xl mx-auto">
            <Card titulo="Equipo A1" descripcion="Equipo con experiencia en desarrollo de software para centros educativos.">
              <FaUsers className="text-5xl text-purple-600" />
            </Card>

            <Card titulo="Centro Educativos con Edutrack" descripcion="Instituciones educativas que facilitan su trabajo gracias a nuestros sistemas.">
              <FaGraduationCap className="text-5xl text-purple-600" />
            </Card>

            <Card titulo="Accesible" descripcion="Queremos que más centros educativos sean parte de Edutrack por lo que contamos con propuestas económicamente accesibles.">
              <FaCoins className="text-4xl text-purple-600" />
            </Card>

            <Card titulo="Atención 24/7" descripcion="Brindamos una atención inmediata y un seguimiento personalizado.">
              <FaHeadset className="text-5xl text-purple-600" />
            </Card>

            <Card titulo="Experiencia Edutrack" descripcion="Interfase intuitiva, práctica, adaptativa y de fácil uso.">
              <FaLaptop className="text-5xl text-purple-600" />
            </Card>

            <Card titulo="Actualizaciones" descripcion="Capacitación, actualización y mejoras constantes sin costo adicional.">
              <FaArrowAltCircleUp className="text-4xl text-purple-600" />
            </Card>
          </div>
        </article>
      </main>
    </>
  );
};

interface Props {
  titulo: string,
  descripcion: string,
  children: ReactNode,
}

const Card = ({ titulo, descripcion, children }: Props) => {
  return (
    <div className="flex flex-col items-center text-center w-90 gap-3 hover:bg-[#FEFEFF] transition ease-in hover:shadow-xl p-12">
      {children}
      <h3 className="text-xl font-semibold mb-2">{titulo}</h3>
      <p className="text-gray-600 max-w-xs text-lg">
        {descripcion}
      </p>
    </div>
  );
}

export default Home;
