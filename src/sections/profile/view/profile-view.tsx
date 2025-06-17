import type { RootState } from 'src/store';

import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export function ProfileView() {
  const user = useSelector((state: RootState) => state.auth.user); // assume you have auth slice

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 4 }} >
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
            {user?.first_name?.[0]}
          </Avatar>
          <Typography variant="h6">{user?.first_name} {user?.last_name}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 8 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Profile Details</Typography>
          <Typography><strong>Contact:</strong> {user?.contact}</Typography>
          <Typography><strong>Gender:</strong> {user?.gender}</Typography>
          <Typography><strong>DOB:</strong> {user?.dob}</Typography>
          <Typography><strong>Address:</strong> {user?.address}</Typography>
        </Card>
      </Grid>
    </Grid>
  );
}
