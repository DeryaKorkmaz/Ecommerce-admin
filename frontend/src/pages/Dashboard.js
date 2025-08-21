import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  MenuItem,
  IconButton, 
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  Divider
  //Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "", stock: "", category: ""});
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [searchTerm, setSearchTerm] = useState(""); // arama input
  const [categoryFilter, setCategoryFilter] = useState(""); 
  const [stockFilter, setStockFilter] = useState("");


 // const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (categoryFilter) params.append("category", categoryFilter);
      if (stockFilter) params.append("stock", stockFilter);
        
      const res = await fetch(`${process.env.REACT_APP_API_URL}/products?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setSnackbar({ open: true, message: "Session expired. Redirecting to login...", severity: "error" });
         window.location.href = "/login"
       // navigate("/login", { replace: true });
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setProducts(data);
        setError("");
      } else {
        setError(data.error || "Failed to fetch");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  // useEffect(() => {
  //   if (!token) {
  //       window.location.href = "/login"
  //     //navigate("/login", { replace: true });
  //   } else {
  //     fetchProducts();
  //   }
  // }, [token]);

   useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token, searchTerm, categoryFilter, stockFilter]);


  const handleLogout = () => {
    localStorage.removeItem("token");
      setSnackbar({
      open: true,
      message: "Logging out...",
      severity: "success",
    });

  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });

    // Eğer logout snackbar ise yönlendirme yap
    if (snackbar.message === "Logging out...") {
      window.location.href = "/login";
    }
    if (snackbar.message === "Session expired. Redirecting to login...") {
      window.location.href = "/login";
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const url = editingId
      ? `${process.env.REACT_APP_API_URL}/products/${editingId}`
      : `${process.env.REACT_APP_API_URL}/products`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ name: "", price: "", description: "", stock: "", category: "" });
        setEditingId(null);
        fetchProducts();
        setError("");
      } else {
        if (res.status === 401) {
          localStorage.removeItem("token");
           window.location.href = "/login"
        //  navigate("/login", { replace: true });
        } else {
          setError(data.error || "Failed to save product");
        }
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    const res = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      fetchProducts();
    }
  };

    const categories = [...new Set(products.map(product => product.category).filter(Boolean))];


return (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>

    <Snackbar
      open={snackbar.open}
      autoHideDuration={1000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbar.severity}
        sx={{ width: "100%", backgroundColor: "#a4ad98ff" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>

    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5ff", py: 4 }}>
      <Container>

        {/* Product Form Card */}
        <Card sx={{ mb: 4 }}>
          <CardHeader title={editingId ? "Edit Product" : "Add Product"} />
          <Divider />
          <CardContent>
            <Box
              component="form"
              noValidate
              autoComplete="off"
            >
              <Stack spacing={2}>
                <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
                <TextField label="Price (₺)" name="price" type="number" value={form.price} onChange={handleChange} fullWidth />
                <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth />
                <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} fullWidth />
                <TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth />
                <Button variant="contained" color={editingId ? "warning" : "primary"} size="small"
                  sx={{
                    px: 5,
                    py: 1.,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                    alignSelf: "flex-start", // Stack içinde sola hizalar
                    width: "auto",            // tam genişlikten kurtarır
                  }} onClick={handleSubmit}>
                  {editingId ? "UPDATE" : "CREATE"}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Filters + Product Table Card */}
        <Card>
          <CardHeader title="Product Management" />
          <Divider />
          <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Filters */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
              <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
              />
              <TextField
                select
                label="Category Filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                size="small"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Stock Filter"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="in">In Stock</MenuItem>
                <MenuItem value="out">Out of Stock</MenuItem>
              </TextField>
            </Box>

            {/* Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Price (₺)</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Stock</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price.toLocaleString()}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton color="primary" onClick={() => handleEdit(product)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDelete(product.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

      </Container>
    </Box>
  </>
);

}

export default Dashboard;
