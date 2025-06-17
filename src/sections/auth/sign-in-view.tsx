import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { useLoginMutation } from '../../api/authApi';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('sadiashah059@gmail.com');
  const [password, setPassword] = useState('StrongPass123');

  const [login, { isLoading, error }] = useLoginMutation();

  const handleSignIn = useCallback(async () => {
    try {
      const result = await login({ email, password }).unwrap();
      localStorage.setItem('token', result.accessToken); // use result.token not result.accessToken
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed', err);
    }
  }, [email, password, login, router]);

  return (
    <>
      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
        <TextField
          fullWidth
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            Login failed. Please check your credentials.
          </Typography>
        )}
      </Box>
    </>
  );
}
