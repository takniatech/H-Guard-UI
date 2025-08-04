import React, { useState, useEffect } from 'react';

import {
    Add,
    Edit,
    Close,
    Check,
    Delete,
    MoreVert,
    PersonAdd
} from '@mui/icons-material';
import {
    Box,
    Menu,
    Table,
    Paper,
    Alert,
    Button,
    Dialog,
    Avatar,
    Select,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    TableHead,
    TextField,
    Typography,
    IconButton,
    InputLabel,
    DialogTitle,
    FormControl,
    DialogContent,
    DialogActions,
    TableContainer,
    CircularProgress,
    DialogContentText
} from '@mui/material';

interface Store {
    id: number;
    nameEn: string;
    nameAr: string;
    description: string;
    image: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

interface StoreAdmin {
    userId: number;
    storeId: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        contact: string;
        email: string;
    };
}

const StoresManagement: React.FC = () => {
    // States
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentStore, setCurrentStore] = useState<Store | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [admins, setAdmins] = useState<StoreAdmin[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
    const [openAdminDialog, setOpenAdminDialog] = useState(false);
    const [adminFormData, setAdminFormData] = useState({
        first_name: '',
        last_name: '',
        contact: '',
        email: '',
        password: '',
        dob: '',
        gender: 'Female',
        address: ''
    });
    const [selectedStoreForAdmin, setSelectedStoreForAdmin] = useState<number | null>(null);
    const [isAssigningAdmin, setIsAssigningAdmin] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        nameEn: '',
        nameAr: '',
        description: '',
        image: '',
        phone: '',
        email: '',
        website: '',
        address: ''
    });

    // Fetch stores
    const fetchStores = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/stores');
            if (!response.ok) throw new Error('Failed to fetch stores');
            const data = await response.json();
            setStores(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Fetch admins for a store
    const fetchAdmins = async (storeId: number) => {
        try {
            const response = await fetch(`https://hgapi.takniatech.ae/api/store-admins/store/${storeId}`);
            if (!response.ok) throw new Error('Failed to fetch admins');
            const data = await response.json();
            setAdmins(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle admin form input changes
    const handleAdminInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAdminFormData(prev => ({ ...prev, [name]: value }));
    };

    // Open store form dialog
    const handleOpenDialog = (store: Store | null, editMode: boolean) => {
        setCurrentStore(store);
        setIsEditMode(editMode);
        if (store) {
            setFormData({
                nameEn: store.nameEn,
                nameAr: store.nameAr,
                description: store.description,
                image: store.image,
                phone: store.phone,
                email: store.email,
                website: store.website,
                address: store.address
            });
        } else {
            setFormData({
                nameEn: '',
                nameAr: '',
                description: '',
                image: '',
                phone: '',
                email: '',
                website: '',
                address: ''
            });
        }
        setOpenDialog(true);
    };

    // Open admin registration dialog
    const handleOpenAdminDialog = () => {
        setAdminFormData({
            first_name: '',
            last_name: '',
            contact: '',
            email: '',
            password: '',
            dob: '',
            gender: 'Female',
            address: ''
        });
        setSelectedStoreForAdmin(null);
        setOpenAdminDialog(true);
        setError(null);
        setSuccessMessage(null);
    };

    // Close dialogs
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentStore(null);
    };

    const handleCloseAdminDialog = () => {
        setOpenAdminDialog(false);
    };

    // Handle menu open
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, storeId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedStoreId(storeId);
    };

    // Handle menu close
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedStoreId(null);
    };

    // Handle view admins
    const handleViewAdmins = (storeId: number) => {
        fetchAdmins(storeId);
        handleMenuClose();
    };

    // Submit form (create/update store)
    const handleSubmit = async () => {
        try {
            const url = isEditMode && currentStore
                ? `https://hgapi.takniatech.ae/api/stores/${currentStore.id}`
                : 'http://localhost:5001/api/stores';

            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} store`);

            const data = await response.json();
            fetchStores();
            handleCloseDialog();
            setSuccessMessage(`Store ${isEditMode ? 'updated' : 'created'} successfully`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    // Register admin and assign to store
    const handleRegisterAndAssignAdmin = async () => {
        if (!selectedStoreForAdmin) {
            setError('Please select a store to assign the admin to');
            return;
        }

        // Validate required fields
        if (!adminFormData.first_name || !adminFormData.last_name ||
            !adminFormData.contact || !adminFormData.email ||
            !adminFormData.password) {
            setError('Please fill in all required fields');
            return;
        }

        setIsAssigningAdmin(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Register the user first
            const registerResponse = await fetch('https://hgapi.takniatech.ae/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...adminFormData,
                    mrn: "000000",
                    userTypeId: 3,
                    isVerified: 1
                }),
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                // Check for specific error messages from the API
                const errorMessage = registerData.message ||
                    registerData.error ||
                    'Failed to register admin';
                throw new Error(errorMessage);
            }

            console.log("registered user", registerData)
            const userId = registerData.user.id;

            // Then assign to store
            const assignResponse = await fetch('http://localhost:5001/api/store-admins/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storeId: selectedStoreForAdmin,
                    userId
                }),
            });

            const assignData = await assignResponse.json();

            if (!assignResponse.ok) {
                const errorMessage = assignData.message ||
                    assignData.error ||
                    'Failed to assign admin to store';
                throw new Error(errorMessage);
            }

            // Refresh admins list if we're viewing a store's admins
            if (selectedStoreId === selectedStoreForAdmin) {
                await fetchAdmins(selectedStoreForAdmin);
            }

            setSuccessMessage('Admin registered and assigned to store successfully');
            handleCloseAdminDialog();
            await fetchStores(); // Refresh stores list
        } catch (err) {
            let errorMessage = 'An unexpected error occurred';

            if (err instanceof Error) {
                errorMessage = err.message;

                // Handle specific error cases
                if (err.message.includes('email')) {
                    errorMessage = 'Email is already registered or invalid';
                } else if (err.message.includes('contact')) {
                    errorMessage = 'Contact number is invalid or already in use';
                } else if (err.message.includes('password')) {
                    errorMessage = 'Password does not meet requirements';
                }
            }

            setError(errorMessage);
            console.error('Admin registration error:', err);
        } finally {
            setIsAssigningAdmin(false);
        }
    };

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [storeToDelete, setStoreToDelete] = useState<number | null>(null);

    const handleOpenDeleteDialog = (storeId: number) => {
        setStoreToDelete(storeId);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setStoreToDelete(null);
    };

    const handleDeleteStore = async () => {
        if (!storeToDelete) return;

        try {
            const response = await fetch(`http://localhost:5001/api/stores/${storeToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete store');

            fetchStores();
            setSuccessMessage('Store deleted successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            handleCloseDeleteDialog();
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this store? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} startIcon={<Close />}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteStore}
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success and Error Messages */}
            {successMessage && (
                <Box my={2}>
                    <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                        {successMessage}
                    </Alert>
                </Box>
            )}
            {error && (
                <Box my={2}>
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                </Box>
            )}

            {/* Action Buttons */}
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<PersonAdd />}
                    onClick={handleOpenAdminDialog}
                >
                    Assign Admin
                </Button>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog(null, false)}
                >
                    Add New Store
                </Button>
            </Box>

            {/* Stores Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '100px' }}>Logo</TableCell>
                            <TableCell>Name (EN)</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stores.map((store) => (
                            <TableRow key={store.id}>
                                <TableCell>
                                    <Avatar
                                        src={store.image}
                                        alt={store.nameEn}
                                        sx={{ width: 60, height: 60 }}
                                    />
                                </TableCell>
                                <TableCell>{store.nameEn}</TableCell>
                                <TableCell>{store.phone}</TableCell>
                                <TableCell>{store.email}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuOpen(e, store.id)}>
                                        <MoreVert />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    const store = stores.find(s => s.id === selectedStoreId);
                    if (store) handleOpenDialog(store, true);
                    handleMenuClose();
                }}>
                    <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => {
                    if (selectedStoreId) handleOpenDeleteDialog(selectedStoreId);
                    handleMenuClose();
                }}>
                    <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
                <MenuItem onClick={() => {
                    if (selectedStoreId) handleViewAdmins(selectedStoreId);
                }}>
                    <Check fontSize="small" sx={{ mr: 1 }} /> View Admins
                </MenuItem>
            </Menu>

            {/* Store Form Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEditMode ? 'Edit Store' : 'Add New Store'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="English Name"
                            name="nameEn"
                            value={formData.nameEn}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Arabic Name"
                            name="nameAr"
                            value={formData.nameAr}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Image URL"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Address"
                            name="address"
                            multiline
                            rows={3}
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} startIcon={<Close />}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        startIcon={<Check />}
                    >
                        {isEditMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Admin Registration Dialog */}
            <Dialog open={openAdminDialog} onClose={handleCloseAdminDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Register and Assign Admin</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Select Store</InputLabel>
                            <Select
                                value={selectedStoreForAdmin || ''}
                                onChange={(e) => setSelectedStoreForAdmin(Number(e.target.value))}
                                label="Select Store"
                            >
                                {stores.map((store) => (
                                    <MenuItem key={store.id} value={store.id}>
                                        {store.nameEn}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="First Name"
                            name="first_name"
                            value={adminFormData.first_name}
                            onChange={handleAdminInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Last Name"
                            name="last_name"
                            value={adminFormData.last_name}
                            onChange={handleAdminInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Contact"
                            name="contact"
                            value={adminFormData.contact}
                            onChange={handleAdminInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Email"
                            name="email"
                            type="email"
                            value={adminFormData.email}
                            onChange={handleAdminInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Password"
                            name="password"
                            type="password"
                            value={adminFormData.password}
                            onChange={handleAdminInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={adminFormData.dob}
                            onChange={handleAdminInputChange}
                        />
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                name="gender"
                                value={adminFormData.gender}
                                onChange={(e) => setAdminFormData({ ...adminFormData, gender: e.target.value as string })}
                                label="Gender"
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            label="Address"
                            name="address"
                            multiline
                            rows={3}
                            value={adminFormData.address}
                            onChange={handleAdminInputChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAdminDialog} startIcon={<Close />}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRegisterAndAssignAdmin}
                        variant="contained"
                        startIcon={<Check />}
                        disabled={isAssigningAdmin || !selectedStoreForAdmin}
                    >
                        {isAssigningAdmin ? <CircularProgress size={24} /> : 'Register & Assign'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Admins Table */}
            {admins.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Store Admins
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Admin</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin.userId}>
                                        <TableCell>
                                            {admin.user.first_name} {admin.user.last_name}
                                        </TableCell>
                                        <TableCell>{admin.user.contact}</TableCell>
                                        <TableCell>{admin.user.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Box>
    );
};

export default StoresManagement;