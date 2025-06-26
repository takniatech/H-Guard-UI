import type { ProductResponse } from 'src/interfaces/product';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export type ProductItemProps = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

type ProductItemComponentProps = {
  product: ProductResponse;
  onDelete?: (productId: number) => void;
};

export function ProductItem({ product, onDelete }: ProductItemComponentProps) {
  const [open, setOpen] = useState(false);

  const rendercategory = (
    <Label
      variant="inverted"
      color="info"
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {product.category.name}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product.image}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      &nbsp;
      {product.price} AED
    </Typography>
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    handleClose();
    if (onDelete) {
      onDelete(product.id);
    }
  };

  return (
    <>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {product.category && rendercategory}
          {renderImg}
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="subtitle1">
            {product.name}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {renderPrice}
            <IconButton 
              aria-label="delete" 
              onClick={handleClickOpen}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Stack>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {product.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}