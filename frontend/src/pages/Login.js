import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
        localStorage.setItem("token", data.token);

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000); // yönlendirme öncesi snackbar görünsün
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Login failed!",
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 10 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
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
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#1976d2" }}>
            Register
          </Link>
        </Typography>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
