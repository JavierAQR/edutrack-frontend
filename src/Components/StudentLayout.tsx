import Navbar from './Navbar';
import { Link, Outlet } from 'react-router-dom';
import Footer from './Footer';

const StudentLayout = () => {
    return (
        <>
            <Navbar>
                <Link to="/estudiante" className="hover:text-gray-900 font-medium">Mi Tablero</Link>
                <Link to="/estudiante/instituciones" className="hover:text-gray-900 font-medium">Instituciones</Link>
                <Link to="/estudiante/cursos" className="hover:text-gray-900 font-medium">Cursos</Link>
                <Link to="/estudiante/evaluaciones" className="hover:text-gray-900 font-medium">Evaluaciones</Link>
                <Link to="/estudiante/payments" className="hover:text-gray-900 font-medium">Pagos</Link>
                
            </Navbar>
            <main className="bg-gradient-to-b from-blue-50 to-white flex justify-center  pb-10 min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default StudentLayout;