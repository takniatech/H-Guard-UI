import { useState, useEffect, useCallback } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Typography,
  Avatar,
  ListItemAvatar,
  Box, // Import Box for centering ActivityIndicator
  CircularProgress // For loading indicator
} from '@mui/material';

// Define the AdminUser interface based on your API response
interface AdminUser {
  id: string; // Assuming 'id' comes as a string from '/users' API
  name: string;
  avatarUrl?: string;
  email?: string;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  storeId: string | number | null;
  onSubmit: (adminIds: string[]) => void;
  assignedAdminIds?: string[]; // Optional: if you want to pre-select admins or show currently assigned admins
};

export function StoreAssignAdminModal({
  open,
  onClose,
  storeId,
  onSubmit,
  assignedAdminIds = [],
}: Props) {
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([
    {
        id: '1',
      name: 'John Doe',
      avatarUrl: 'https://example.com/avatar1.jpg',
      email: 'john@example.com'
    },
    {
        id: '2',
      name: 'Jane Smith',
      avatarUrl: 'https://example.com/avatar2.jpg',
      email: 'jane@example.com'
    },
    {
        id: '3',
      name: 'Bob Johnson',
      avatarUrl: 'https://example.com/avatar3.jpg',
      email: 'bob@example.com'
    }
  ]); // State for fetched users
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleToggleAdmin = (adminId: string) => {
    setSelectedAdmins((prevSelected) =>
      prevSelected.includes(adminId)
        ? prevSelected.filter((id) => id !== adminId)
        : [...prevSelected, adminId]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedAdmins);
    onClose(); // Close modal after submit
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>Assign Admins to Store {storeId ? `(ID: ${storeId})` : ''}</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>Loading admins...</Typography>
          </Box>
        ) : fetchError ? (
          <Typography color="error" sx={{ p: 3, textAlign: 'center' }}>{fetchError}</Typography>
        ) : users.length > 0 ? (
          <List>
            {users.map((admin) => ( // Loop directly over the 'users' state
              <ListItem
                key={admin.id} // Use admin.id directly
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={() => handleToggleAdmin(admin.id)}
                    checked={selectedAdmins.includes(admin.id)}
                  />
                }
                disablePadding
              >
                <ListItemAvatar sx={{ pl: 2 }}>
                  {/* Provide a fallback for avatarUrl if it's null or invalid */}
                  <Avatar alt={admin.name} src={admin.avatarUrl || ''} />
                </ListItemAvatar>
                <ListItemText primary={admin.name} secondary={admin.email || 'N/A'} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ p: 3, textAlign: 'center' }}>No admins available.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!selectedAdmins.length}>Assign</Button>
      </DialogActions>
    </Dialog>
  );
}