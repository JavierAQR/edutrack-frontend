import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";
import { FaUserTie, FaRegBuilding } from "react-icons/fa";
import { PiChalkboardTeacher, PiStudent } from "react-icons/pi";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { TbReportSearch } from "react-icons/tb";
import { IoBook } from "react-icons/io5";
import api from "../../api/axiosConfig";

const cards = [
  {
    key: "admins",
    label: "Administradores",
    icon: <RiAdminLine size={40} color="#1976d2" />,
    color: "#e3f2fd",
    route: "/admin/administrators",
  },
  {
    key: "directors",
    label: "Directores",
    icon: <FaUserTie size={40} color="#0288d1" />,
    color: "#e1f5fe",
    route: "/admin/dashboard", // Cambia si tienes ruta específica
  },
  {
    key: "teachers",
    label: "Profesores",
    icon: <PiChalkboardTeacher size={40} color="#388e3c" />,
    color: "#e8f5e9",
    route: "/admin/teachers",
  },
  {
    key: "students",
    label: "Alumnos",
    icon: <PiStudent size={40} color="#fbc02d" />,
    color: "#fffde7",
    route: "/admin/students",
  },
  {
    key: "institutions",
    label: "Instituciones",
    icon: <FaRegBuilding size={40} color="#8e24aa" />,
    color: "#f3e5f5",
    route: "/admin/institutions",
  },
  {
    key: "academicLevels",
    label: "Niveles Académicos",
    icon: <HiMiniAcademicCap size={40} color="#d84315" />,
    color: "#fbe9e7",
    route: "/admin/academic-levels",
  },
  {
    key: "academicGrades",
    label: "Grados Académicos",
    icon: <TbReportSearch size={40} color="#00897b" />,
    color: "#e0f2f1",
    route: "/admin/academic-grades",
  },
  {
    key: "courses",
    label: "Cursos",
    icon: <IoBook size={40} color="#5d4037" />,
    color: "#efebe9",
    route: "/admin/courses",
  },
];

const DashboardAdmin = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/admin/dashboard/counts")
      .then(res => setCounts(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map(card => (
          <Grid item xs={12} sm={6} md={3} key={card.key}>
            <Card
              sx={{
                background: card.color,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={() => navigate(card.route)}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {card.icon}
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    {card.label}
                  </Typography>
                </Box>
                <Typography variant="h3" align="right">
                  {counts[card.key] ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardAdmin;