import type { SelectChangeEvent } from '@mui/material';

import React, { useState, useEffect, useCallback } from 'react';

import TodayIcon from '@mui/icons-material/Today';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import {
    Box,
    Chip,
    List,
    Table,
    Paper,
    Alert,
    Select,
    Button,
    Dialog,
    Avatar,
    Divider,
    TableRow,
    MenuItem,
    Checkbox,
    ListItem,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    DialogTitle,
    ListItemText,
    DialogContent,
    DialogActions,
    TableContainer,
    ListItemAvatar,
    CircularProgress,
    FormControlLabel
} from '@mui/material';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    product: Product;
}

interface Status {
    id: number;
    status: string;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    contact: string;
    address: string;
}

interface Order {
    id: number;
    userId: number;
    orderStatusId: number;
    acceptedById: number | null;
    createdAt: string;
    updatedAt: string;
    user: User;
    status: Status;
    items: OrderItem[];
}

const statusOptions = [
    { id: 1, status: 'request' },
    { id: 2, status: 'accept' },
    { id: 5, status: 'complete' },
];

const OrdersTable: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');
    const [myOrdersOnly, setMyOrdersOnly] = useState(false);
    const [newOrdersOnly, setNewOrdersOnly] = useState(false);
    const [todayOrdersOnly, setTodayOrdersOnly] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // Fetch orders function with useCallback to prevent unnecessary recreations
    const REACT_APP_URL = "https://hgapi.takniatech.ae/api"
    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch(`${REACT_APP_URL}/orders`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
            setFilteredOrders(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Get user ID from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setCurrentUserId(user.id);
        }

        // Initial fetch
        fetchOrders();

        // Set up interval for auto-refresh
        const intervalId = setInterval(fetchOrders, 30000); // 30 seconds

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [fetchOrders]);

    useEffect(() => {
        let result = [...orders];

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(order => order.orderStatusId === statusFilter);
        }

        // Apply "My Orders" filter
        if (myOrdersOnly && currentUserId) {
            result = result.filter(order =>
                order.acceptedById === currentUserId || order.userId === currentUserId
            );
        }

        // Apply "New Orders" filter (no acceptedById)
        if (newOrdersOnly) {
            result = result.filter(order => order.acceptedById === null);
        }

        // Apply "Today's Orders" filter
        if (todayOrdersOnly) {
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            result = result.filter(order =>
                order.createdAt.split('T')[0] === todayString
            );
        }

        setFilteredOrders(result);
    }, [orders, statusFilter, myOrdersOnly, newOrdersOnly, todayOrdersOnly, currentUserId]);

    const handleStatusChange = async (orderId: number, newStatusId: number) => {
        setUpdating(orderId);
        setSuccessMessage(null);
        setError(null);

        try {
            const response = await fetch(`${REACT_APP_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderStatusId: newStatusId,
                    acceptedById: currentUserId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            const updatedOrder = await response.json();

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? {
                            ...order,
                            orderStatusId: updatedOrder.orderStatusId,
                            acceptedById: updatedOrder.acceptedById,
                            status: statusOptions.find(s => s.id === updatedOrder.orderStatusId) || order.status,
                            updatedAt: updatedOrder.updatedAt
                        }
                        : order
                )
            );

            setSuccessMessage(`Order #${orderId} status updated successfully`);

            // Refresh orders after successful update
            setTimeout(fetchOrders, 1000);
        } catch (err) {
            setError('Failed to update order status');
        } finally {
            setUpdating(null);
        }
    };

    const handleStatusFilterChange = (e: SelectChangeEvent<number | 'all'>) => {
        setStatusFilter(e.target.value === 'all' ? 'all' : Number(e.target.value));
    };

    const handleMyOrdersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMyOrdersOnly(e.target.checked);
    };

    const handleNewOrdersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewOrdersOnly(e.target.checked);
    };

    const handleTodayOrdersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTodayOrdersOnly(e.target.checked);
    };

    const resetFilters = () => {
        setStatusFilter('all');
        setMyOrdersOnly(false);
        setNewOrdersOnly(false);
        setTodayOrdersOnly(false);
    };

    // Order Information
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const handleRowClick = (order: Order) => {
        if (myOrdersOnly) {
            setSelectedOrder(order);
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box my={2}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box>
            {successMessage && (
                <Box my={2}>
                    <Alert severity="success">{successMessage}</Alert>
                </Box>
            )}

            <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                    <FilterAltIcon color="primary" />
                    <Select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        size="small"
                        sx={{ minWidth: 120 }}
                    >
                        <MenuItem value="all">All Statuses</MenuItem>
                        {statusOptions.map((status) => (
                            <MenuItem key={status.id} value={status.id}>
                                {status.status}
                            </MenuItem>
                        ))}
                    </Select>

                    {currentUserId && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={myOrdersOnly}
                                    onChange={handleMyOrdersChange}
                                    color="primary"
                                />
                            }
                            label="My Orders"
                        />
                    )}

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newOrdersOnly}
                                onChange={handleNewOrdersChange}
                                color="primary"
                                icon={<NewReleasesIcon />}
                                checkedIcon={<NewReleasesIcon />}
                            />
                        }
                        label="New Orders"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={todayOrdersOnly}
                                onChange={handleTodayOrdersChange}
                                color="primary"
                                icon={<TodayIcon />}
                                checkedIcon={<TodayIcon />}
                            />
                        }
                        label="Today's Orders"
                    />
                </Box>

                <Button
                    variant="outlined"
                    onClick={resetFilters}
                    size="small"
                >
                    Reset Filters
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Address</TableCell>
                            {/* <TableCell>Contact</TableCell> */}
                            <TableCell>Date</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Accepted By</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    hover
                                    onClick={() => handleRowClick(order)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        {order.user.address}
                                    </TableCell>
                                    {/* <TableCell>{order.user.contact}</TableCell> */}
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                        <br />
                                        {new Date(order.createdAt).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>
                                        {order.items.map((item) => (
                                            <Box key={item.id} mb={1}>
                                                {item.quantity} x {item.product.name} (AED {item.product.price})
                                            </Box>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        AED{' '}
                                        {order.items.reduce(
                                            (sum, item) => sum + item.quantity * item.product.price,
                                            0
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {updating === order.id ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            <Select
                                                value={order.orderStatusId}
                                                onChange={(e: SelectChangeEvent<number>) =>
                                                    handleStatusChange(order.id, Number(e.target.value))
                                                }
                                                size="small"
                                                sx={{ minWidth: 120 }}
                                            >
                                                {statusOptions.map((status) => (
                                                    <MenuItem key={status.id} value={status.id}>
                                                        {status.status}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {order.acceptedById ? `User #${order.acceptedById}` : 'Not accepted'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    No orders found matching your filters
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>


            {/* Order Details Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                {selectedOrder && (
                    <>
                        <DialogTitle>
                            Order #{selectedOrder.id} Details
                            <Chip
                                label={selectedOrder.status.status}
                                color={
                                    selectedOrder.orderStatusId === 1 ? 'default' :
                                        selectedOrder.orderStatusId === 2 ? 'primary' :
                                            selectedOrder.orderStatusId === 5 ? 'success' : 'default'
                                }
                                sx={{ ml: 2 }}
                            />
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box mb={3}>
                                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <List>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {selectedOrder.user.first_name.charAt(0)}
                                                {selectedOrder.user.last_name.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${selectedOrder.user.first_name} ${selectedOrder.user.last_name}`}
                                            secondary={`Contact: ${selectedOrder.user.contact}`}
                                        />
                                    </ListItem>
                                </List>
                            </Box>

                            <Box mb={3}>
                                <Typography variant="h6" gutterBottom>Order Summary</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <List>
                                    <ListItem>
                                        <ListItemText
                                            primary="Order Date"
                                            secondary={new Date(selectedOrder.createdAt).toLocaleString()}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Address"
                                            secondary={selectedOrder.user.address}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Last Updated"
                                            secondary={new Date(selectedOrder.updatedAt).toLocaleString()}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Accepted By"
                                            secondary={selectedOrder.acceptedById ? `User #${selectedOrder.acceptedById}` : 'Not accepted yet'}
                                        />
                                    </ListItem>
                                </List>
                            </Box>

                            <Box mb={3}>
                                <Typography variant="h6" gutterBottom>Order Items</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Avatar
                                                                src={item.product.image}
                                                                alt={item.product.name}
                                                                sx={{ width: 40, height: 40, mr: 2 }}
                                                            />
                                                            {item.product.name}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">AED {item.product.price}</TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                    <TableCell align="right">AED {item.quantity * item.product.price}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell colSpan={3} align="right">
                                                    <Typography variant="subtitle1">Grand Total:</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="subtitle1">
                                                        AED {selectedOrder.items.reduce(
                                                            (sum, item) => sum + item.quantity * item.product.price,
                                                            0
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {/* <Box>
                                <Typography variant="h6" gutterBottom>Update Status</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Select
                                    value={selectedOrder.orderStatusId}
                                    onChange={(e: SelectChangeEvent<number>) =>
                                        handleStatusChange(selectedOrder.id, Number(e.target.value))
                                    }
                                    fullWidth
                                    size="small"
                                >
                                    {statusOptions.map((status) => (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box> */}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default OrdersTable;