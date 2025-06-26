import type { RootState } from 'src/store';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Box,
  Card,
  Stack,
  Avatar,
  styled,
  Button,
  Divider,
  Typography
} from '@mui/material';

import { PasswordUpdateDialog } from '../update-password';


const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 0),
  width: '100%',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  fontSize: 32,
  marginRight: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StoreLogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(2),
  margin: theme.spacing(3, 0),
  '& img': {
    maxWidth: '100%',
    maxHeight: 80,
    borderRadius: theme.shape.borderRadius,
  }
}));

const DetailItem = ({ label, value }: { label: string; value?: string | null }) => (
  <Box sx={{ mb: 2, width: '100%' }}>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      {value || 'Not provided'}
    </Typography>
    <Divider />
  </Box>
);

export function ProfileView() {
  const { user, store } = useSelector((state: RootState) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Stack spacing={4} sx={{ width: '100%', p: 3 }}>

      {/* User Profile Section */}
      <Card sx={{
        p: 3,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        width: '100%'
      }}>

        <ProfileHeader>
          <ProfileAvatar>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </ProfileAvatar>
          <Box>
            <Typography variant="h5" component="div">
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="body1" component="div">
              {user?.userType}
            </Typography>

          </Box>
        </ProfileHeader>

        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
            Personal Information
          </Typography>
          <DetailItem label="Email" value={user?.email} />
          <DetailItem label="Contact" value={user?.contact} />
          <DetailItem label="Date of Birth" value={new Date(user?.dob).toLocaleDateString()} />
          <DetailItem label="Age" value={user?.age} />
          <DetailItem label="Gender" value={user?.gender} />
          <DetailItem label="Address" value={user?.address} />
        </Box>
      </Card>

      {/* Store Section - Only shown if store exists */}
      {store && (
        <Card sx={{
          p: 3,
          backgroundColor: 'transparent',
          boxShadow: 'none',
          width: '100%'
        }}>
          <Typography variant="h5" component="div" sx={{ mb: 2 }}>
            Store Information
          </Typography>

          <StoreLogoContainer>
            <img
              src={store.store.image}
              alt={store.store.nameEn}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/default-store.png';
              }}
            />
          </StoreLogoContainer>

          <Box sx={{ width: '100%' }}>
            <DetailItem label="Store Name" value={store.store.nameEn} />
            <DetailItem label="Description" value={store.store.description} />
            <DetailItem label="Phone" value={store.store.phone} />
            <DetailItem label="Email" value={store.store.email} />
            <DetailItem label="Website" value={store.store.website} />
            <DetailItem label="Address" value={store.store.address} />
          </Box>

        </Card>
      )}
      <Button
        variant="contained"
        onClick={() => setOpenDialog(true)}
      >
        Change Password
      </Button>

      <PasswordUpdateDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </Stack>
  );
}