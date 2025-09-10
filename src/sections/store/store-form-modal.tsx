import { useState, useEffect } from 'react';

import {
  Stack,

  Dialog,

  Button,

  TextField,

  DialogTitle,

  DialogContent,

  DialogActions,
} from '@mui/material';

interface Store {
  id?: number | string;
  nameEn: string;
  nameAr: string;
  description: string;
  image: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  store: Store | null;
  onSubmit: (values: Store) => void;
};

export function StoreFormModal({ open, onClose, store, onSubmit }: Props) {
  const [values, setValues] = useState<Store>({
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

  useEffect(() => {
    if (store) {
      setValues(store);
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

  const handleChange =
    (field: keyof Store) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
            label="Phone Number"
            value={values.phone}
            onChange={handleChange('phone')}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            required
          />
          <TextField
            fullWidth
            label="Address"
            value={values.address}
            onChange={handleChange('address')}
            multiline
            rows={2}
            required
          />
          <TextField
            fullWidth
            label="Website"
            type="url"
            value={values.website}
            onChange={handleChange('website')}
            required
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={values.description}
            onChange={handleChange('description')}
          />
          <TextField
            fullWidth
            label="Image URL"
            type="url"
            value={values.image}
            onChange={handleChange('image')}
          />
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