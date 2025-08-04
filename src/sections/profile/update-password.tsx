import React from 'react';
import { useForm } from 'react-hook-form';

import {
  Box,
  Alert,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { useUpdatePasswordMutation } from '../../api/authApi';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordUpdateFormProps {
  onSuccess?: () => void;
}

interface PasswordUpdateDialogProps {
  open: boolean;
  onClose: () => void;
}

export const PasswordUpdateDialog: React.FC<PasswordUpdateDialogProps> = ({ 
  open, 
  onClose 
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Password</DialogTitle>
      <DialogContent>
        <UpdatePassword onSuccess={onClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );

export const UpdatePassword: React.FC<PasswordUpdateFormProps> = ({ onSuccess }) => {
  const [updatePassword, { isLoading, error, isSuccess }] = useUpdatePasswordMutation();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<PasswordFormData>();

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      }).unwrap();
      
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log("Update password Error", err)
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {'data' in error ? 
            (error.data as { message?: string }).message || 'Failed to update password' : 
            'Failed to update password'}
        </Alert>
      )}
      
      {isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Password updated successfully!
        </Alert>
      )}
      
      <TextField
        margin="normal"
        fullWidth
        required
        label="Current Password"
        type="password"
        {...register('currentPassword', { required: 'Current password is required' })}
        error={!!errors.currentPassword}
        helperText={errors.currentPassword?.message}
      />
      
      <TextField
        margin="normal"
        fullWidth
        required
        label="New Password"
        type="password"
        {...register('newPassword', { 
          required: 'New password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters'
          },
          validate: {
            hasUpper: v => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
            hasLower: v => /[a-z]/.test(v) || 'Must contain at least one lowercase letter',
            hasNumber: v => /[0-9]/.test(v) || 'Must contain at least one number'
          }
        })}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
      />
      
      <TextField
        margin="normal"
        fullWidth
        required
        label="Confirm New Password"
        type="password"
        {...register('confirmPassword', {
          validate: value => 
            value === watch('newPassword') || "Passwords don't match"
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      
      <DialogActions sx={{ px: 0 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Update Password'
          )}
        </Button>
      </DialogActions>
      
      <Typography variant="body2" color="text.secondary" mt={2}>
        Password requirements:
      </Typography>
      <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2, mt: 1 }}>
        <li>At least 8 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one lowercase letter</li>
        <li>At least one number</li>
      </Typography>
    </Box>
  );
};