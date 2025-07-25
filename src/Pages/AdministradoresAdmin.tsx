import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";


interface Admin {
  id: number;
  name: string;
  lastname: string;
  email: string;
  username: string;
  birthdate: string;
  password?: string;
}


const AdministradoresAdmin = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [form, setForm] = useState<Partial<Admin>>({});

  const fetchAdmins = async () => {
  const res = await api.get("/admin/administrators");
  setAdmins(res.data);
};

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenModal = (admin?: Admin) => {
    setEditingAdmin(admin || null);
    setForm(admin || {});
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAdmin(null);
    setForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (editingAdmin) {
    await api.put(`/admin/administrators/${editingAdmin.id}`, form);
  } else {
    await api.post("/admin/administrators", form);
  }
  fetchAdmins();
  handleCloseModal();
};

  const handleDelete = async (id: number) => {
  if (window.confirm("¿Seguro que deseas eliminar este administrador?")) {
    await api.delete(`/admin/administrators/${id}`);
    fetchAdmins();
  }
};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administradores
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
        Agregar Administrador
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.lastname}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.username}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenModal(admin)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(admin.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{editingAdmin ? "Editar Administrador" : "Agregar Administrador"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label="Nombre"
              fullWidth
              value={form.name || ""}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="lastname"
              label="Apellido"
              fullWidth
              value={form.lastname || ""}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={form.email || ""}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="username"
              label="Usuario"
              fullWidth
              value={form.username || ""}
              onChange={handleChange}
              required
            />

            <TextField
                margin="dense"
                name="birthdate"
                label="Fecha de nacimiento"
                type="date"
                fullWidth
                value={form.birthdate || ""}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
            />
        {!editingAdmin && (
            <TextField
                margin="dense"
                name="password"
                label="Contraseña"
                type="password"
                fullWidth
                value={form.password || ""}
                onChange={handleChange}
                required
                />
            )}

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingAdmin ? "Actualizar" : "Crear"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdministradoresAdmin;