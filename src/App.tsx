import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import VerificationPage from "./Pages/VerificationPage";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import AboutUs from "./Pages/AboutUs";
import Services from "./Pages/Services";
import MainLayout from "./Components/MainLayout";
import PaymentPage from "./Pages/Payment";
import SidebarAdmin from "./Components/SidebarAdmin";
import InstitutionManager from "./Pages/Admin/InstitutionManager";
import AcademicLevelManager from "./Pages/Admin/AcademicLevelManager";
import GradeManager from "./Pages/Admin/GradeManager";
import CourseAssignmentManager from "./Pages/Admin/CourseAssignmentManager";
import Dashboard from "./Pages/Admin/Dashboard";
import TeacherManager from "./Pages/Admin/TeacherManager";
import CompleteTeacherProfile from "./Pages/Teacher/CompleteTeacherProfile";
import TeacherProfile from "./Pages/Teacher/TeacherProfile";
import SidebarTeacher from "./Components/SidebarTeacher";
import CompleteStudentProfile from "./Pages/Student/CompleteStudentProfile";
import VerificationRole from "./Components/VerificationRole";
import SidebarStudent from "./Components/SidebarStudent";
import StudentProfile from "./Pages/Student/StudentProfile";
import StudentManager from "./Pages/Admin/StudentManager";
import SidebarInstitutionAdmin from "./Components/SidebarInstitutionAdmin";
import InstitutionGradeManager from "./Pages/Admin/InstitutionGradeManager";
import SectionManager from "./Pages/Institution_Admin/Section/SectionManager";
import TeacherSections from "./Pages/Teacher/TeacherSections";
import DetalleSeccion from "./Pages/Teacher/DetalleSeccion";
import TareasSeccion from "./Pages/Teacher/TareasSeccion";
import StudentSectionsView from "./Pages/Student/StudentSectionsView";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="contactanos" element={<Contact />} />
            <Route path="nosotros" element={<AboutUs />} />
            <Route path="servicios" element={<Services />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verification" element={<VerificationPage />} />
          </Route>

          {/* Rutas de administrador */}
          <Route
            element={<VerificationRole allowedRoles={["INSTITUTION_ADMIN"]} />}
          >
            <Route
              path="/institution-admin"
              element={<SidebarInstitutionAdmin />}
            >
              <Route index element={<Navigate to="grades" replace />} />
              <Route path="grades" element={<InstitutionGradeManager />} />
              <Route path="sections" element={<SectionManager />} />
            </Route>
          </Route>

          {/* Rutas de estudiante */}
          <Route element={<VerificationRole allowedRoles={["STUDENT"]} />}>
            <Route path="/estudiante" element={<SidebarStudent />}>
              <Route index element={<StudentProfile />} />
              <Route path="perfil" element={<StudentProfile />} />
              <Route path="sections" element={<StudentSectionsView />} />
              <Route path="payments" element={<PaymentPage />} />
            </Route>
            <Route
              path="complete-student-profile"
              element={<CompleteStudentProfile />}
            />
          </Route>

          {/* Rutas de profesor */}
          <Route element={<VerificationRole allowedRoles={["TEACHER"]} />}>
            <Route path="/profesor" element={<SidebarTeacher />}>
              <Route index element={<Navigate to="perfil" replace />} />
              <Route path="perfil" element={<TeacherProfile />} />
              <Route path="sections" element={<TeacherSections />} />
              <Route path="secciones/:id" element={<DetalleSeccion />} />
              <Route path="secciones/:id/tareas" element={<TareasSeccion />} />
            </Route>
            <Route
              path="complete-teacher-profile"
              element={<CompleteTeacherProfile />}
            />
          </Route>

          {/* Rutas de administrador */}
          <Route element={<VerificationRole allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<SidebarAdmin />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="teachers" element={<TeacherManager />} />
              <Route path="students" element={<StudentManager />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="institutions" element={<InstitutionManager />} />
              <Route
                path="academic-levels"
                element={<AcademicLevelManager />}
              />
              <Route path="academic-grades" element={<GradeManager />} />
              <Route path="courses" element={<CourseAssignmentManager />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
