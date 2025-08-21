import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Registration successful!",
          severity: "success",
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Registration failed!",
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "An error occurred",
        severity: "error",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        {/* Başlık */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Welcome!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your account to access the dashboard.
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </Box>

        {/* Alt bağlantı */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1976d2" }}>
            Login
          </Link>
        </Typography>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Register;
