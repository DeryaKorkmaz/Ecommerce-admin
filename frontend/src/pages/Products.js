import { useEffect, useState, useCallback } from "react";
import {
    Button,
    TextField,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    // Paper,
    Snackbar,
    MenuItem,
    IconButton,
    //   Tooltip,
    Card,
    CardContent,
    CardHeader,
    Divider,
    //   Box,
    Stack,
    //   Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import { styled } from '@mui/material/styles';

function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: "", price: "", description: "", stock: "", category: "" });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const token = localStorage.getItem("token");

    const fetchProducts = useCallback(async () => {
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
                window.location.href = "/login";
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
    }, [token, searchTerm, categoryFilter, stockFilter]);

    useEffect(() => {
        if (token) {
            fetchProducts();
        }
    }, [fetchProducts, token]);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setSelectedFileName(file.name);
        } else {
            setSelectedFile(null);
            setSelectedFileName("");
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${process.env.REACT_APP_API_URL}/uploadimage`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        if (!res.ok) {
            throw new Error("Image upload failed");
        }

        const data = await res.json();
        return data.url;
    };

    const handleSubmit = async () => {
        try {
            let imageUrl = form.image_url || "";

            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile);
            }

            const url = editingId
                ? `${process.env.REACT_APP_API_URL}/products/${editingId}`
                : `${process.env.REACT_APP_API_URL}/products`;
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price),
                    stock: parseInt(form.stock),
                    image_url: imageUrl,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSnackbar({
                    open: true,
                    message: editingId ? "Product updated successfully!" : "Product created successfully!",
                    severity: "success",
                });
                setForm({ name: "", price: "", description: "", stock: "", category: "", image_url: "" });
                setEditingId(null);
                setSelectedFile(null);
                setSelectedFileName("");
                setShowForm(false);
                fetchProducts();
                setError("");
            } else {
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
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
            category: product.category || ""
        });
        setSelectedFile(null);
        setSelectedFileName("");
        setEditingId(product.id);
        setShowForm(true);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setEditingId(null);
                        setForm({ name: "", price: "", description: "", stock: "", category: "", image_url: "" });
                        setShowForm(!showForm);
                    }}
                    sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}
                >
                    {showForm ? "Cancel" : "Add Product"}
                </Button>
            </div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {showForm && (
                <Card className="shadow-lg border-none">
                    <CardHeader title={editingId ? "Edit Product" : "New Product"} />
                    <Divider />
                    <CardContent>
                        <Stack spacing={3}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
                                <TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth />
                                <TextField label="Price (₺)" name="price" type="number" value={form.price} onChange={handleChange} fullWidth />
                                <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} fullWidth />
                            </div>
                            <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} />

                            <div className="flex items-center gap-4">
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    {selectedFileName || "Upload Image"}
                                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                                </Button>
                                {selectedFile && (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="preview"
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                size="large"
                                sx={{ alignSelf: 'flex-start', bgcolor: '#2563eb' }}
                            >
                                {editingId ? "Update Product" : "Create Product"}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            <Card className="shadow-lg border-none">
                <CardContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <div className="flex flex-wrap gap-4 mb-6 justify-end">
                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                            className="w-64"
                        />
                        <TextField
                            select
                            label="Category"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            size="small"
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Stock Status"
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            size="small"
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="in">In Stock</MenuItem>
                            <MenuItem value="out">Out of Stock</MenuItem>
                        </TextField>
                    </div>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id} hover>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                                        No Img
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                                                {product.category}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium">₺{product.price.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => handleEdit(product)} size="small">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(product.id)} size="small">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </div>
    );
}

export default Products;
