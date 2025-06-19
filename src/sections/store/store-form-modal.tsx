import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  store: any;
  onSubmit: (values: any) => void;
};
interface Store {
  id?: number;
  nameEn: string;
  nameAr: string;
  description: string;
  image: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}
export function StoreFormModal({ open, onClose, store, onSubmit }: Props) {
  const [values, setValues] = useState({
    id: '',
    nameEn: '',
    nameAr: '',
    email: '',
    website: '',
    phone: '',
    image: '',
    address: '',
    description: '',
  });

  useEffect(() => {
    if (store) {
      setValues({
        id: store.id,
        nameEn: store.nameEn,
        nameAr: store.nameAr,
        email: store.email,
        website: store.website,
        image: store.image,
        address: store.address,
        phone: store.phone,
        description: store.description,
      });
    } else {
      setValues({
        id: '',
        nameEn: '',
        nameAr: '',
        email: '',
        website: '',
        image: '',
        address: '',
        phone: '',
        description: 'active',
      });
    }
  }, [store]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>{store ? 'Edit Store' : 'Add New Store'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Store English Name"
            value={values.nameEn}
            onChange={handleChange('nameEn')}
            required
          />
          <TextField
            fullWidth
            label="Store Arabic Name"
            value={values.nameAr}
            onChange={handleChange('nameAr')}
            required
          />
          <TextField
            fullWidth
            label="Store Phonenumber"
            value={values.phone}
            onChange={handleChange('phone')}
            required
          />
          <TextField
            fullWidth
            label="Store Email"
            value={values.email}
            type='email'
            onChange={handleChange('email')}
            required
          />
          <TextField
            fullWidth
            label="Address"
            value={values.address}
            onChange={handleChange('address')}
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="Website"
            value={values.website}
            onChange={handleChange('website')}
            required
          />
          <TextField
            fullWidth
            label="description"
            multiline
            rows={3}
            value={values.description}
            onChange={handleChange('description')}
          />
          <TextField
          fullWidth
            value={values.image}
            onChange={handleChange('image')} type='text'  label='Image' />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {store ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}