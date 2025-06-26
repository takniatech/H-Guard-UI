import { useState } from 'react';

import { Box, Button, CircularProgress, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface LoadingOverlayProps {
  isLoading: boolean;
}

function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="white"
      zIndex={10}
    >
      <CircularProgress />
    </Box>
  );
}

export default function LookerStudioEmbed() {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0); // This key will force iframe refresh

  const handleReload = () => {
    setIframeKey(prev => prev + 1);  // Changing key will remount iframe
    setIsLoading(true);
  };

  return (
    <Box position="relative" width="100%" height="100%">
      <LoadingOverlay isLoading={isLoading} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Welcome to Health Guard</Typography>

        <Button
          variant="text"
          color="inherit"
          startIcon={<Iconify icon="solar:restart-bold" />}
          onClick={handleReload}
        >
          Refresh
        </Button>
      </Box>


      <iframe
        key={iframeKey}
        title="Looker Studio Report"
        width="100%"
        height="450"
        src="https://lookerstudio.google.com/embed/reporting/9e2b9166-a7b8-4ad2-8abf-c3e10f23bf4f/page/20oOF"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        onLoad={() => setIsLoading(false)}
      />


    </Box>
  );
}