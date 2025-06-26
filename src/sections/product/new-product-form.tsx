import * as yup from 'yup';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
    Box,
    Tab,
    Tabs,
    Alert,
    Button,
    Dialog,
    MenuItem,
    Snackbar,
    TextField,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    CircularProgress,
} from '@mui/material';

import { uploadImage } from "src/sanity/client";
import { useCreateProductMutation } from 'src/api/productApi';

import { Iconify } from 'src/components/iconify';

const schema = yup.object().shape({
    name: yup.string().required('Product name is required'),
    category: yup.string().required('Category is required'),
    price: yup
        .number()
        .typeError('Price must be a number')
        .positive('Price must be positive')
        .required('Price is required'),
    image: yup.mixed().test(
        'image-required',
        'Image is required when no URL is provided',
        function (value) {
            if (this.parent.activeTab === 0 && !this.parent.imageUrl) {
                return !!value;
            }
            return true;
        }
    ),
    imageUrl: yup.string().test(
        'url-required',
        'Image URL is required when no file is uploaded',
        function (value) {
            if (this.parent.activeTab === 1 && !this.parent.image) {
                return !!value && yup.string().url().isValidSync(value);
            }
            return true;
        }
    ),
    activeTab: yup.number().required()
});

type Category = {
    value: number,
    label: string
}

export default function NewProductForm({ categories = [] }: { categories: Category[] }) {
    const [open, setOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const [createProduct] = useCreateProductMutation();
    
    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            category: '',
            price: 0,
            image: "",
            imageUrl: '',
            activeTab: 0,
        },
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            let imageUrl = data.imageUrl;

            if (data.image && !imageUrl) {
                imageUrl = await uploadImage(data.image);
            }

            const productData = {
                name: data.name,
                price: data.price,
                categoryId: data.category,
                image: imageUrl,
                description: ""
            };

            await createProduct(productData).unwrap();
            
            setAlert({
                open: true,
                message: 'Product created successfully!',
                severity: 'success'
            });
            
            handleClose();
        } catch (error) {
            console.error('Failed to submit product:', error);
            setAlert({
                open: true,
                message: 'Failed to create product',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('image', file);
            setValue('imageUrl', '');
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setValue('imageUrl', url);
        if (url) {
            setValue('image', "");
            setImagePreview(url);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setValue('activeTab', newValue);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        reset();
        setImagePreview('');
    };

    const handleAlertClose = () => {
        setAlert({...alert, open: false});
    };

    return (
        <>
            <Button
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleOpen}
            >
                Add Product
            </Button>

            <Dialog 
                open={open} 
                onClose={isSubmitting ? undefined : handleClose} 
                maxWidth="lg" 
                fullWidth
            >
                <DialogTitle>Add New Product</DialogTitle>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <DialogContent>
                        {isSubmitting && (
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                zIndex: 1
                            }}>
                                <CircularProgress size={60} />
                            </Box>
                        )}

                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Product Name"
                                    {...field}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    sx={{ mb: 2 }}
                                    disabled={isSubmitting}
                                />
                            )}
                        />

                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    select
                                    fullWidth
                                    label="Category"
                                    {...field}
                                    error={!!errors.category}
                                    helperText={errors.category?.message}
                                    sx={{ mb: 2 }}
                                    disabled={isSubmitting}
                                >
                                    {categories.map(option => (
                                        <MenuItem key={option.value} value={option.value.toString()}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    {...field}
                                    error={!!errors.price}
                                    helperText={errors.price?.message}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                                    }}
                                    sx={{ mb: 2 }}
                                    disabled={isSubmitting}
                                />
                            )}
                        />

                        <Box sx={{ mb: 3 }}>
                            <Tabs 
                                value={activeTab} 
                                onChange={handleTabChange} 
                                sx={{ mb: 2 }}
                                // disabled={isSubmitting}
                            >
                                <Tab label="Upload Image" />
                                <Tab label="Image URL" />
                            </Tabs>

                            {activeTab === 0 ? (
                                <Box>
                                    <Button 
                                        variant="outlined" 
                                        component="label" 
                                        sx={{ mb: 1 }}
                                        disabled={isSubmitting}
                                    >
                                        Upload Image
                                        <input 
                                            type="file" 
                                            hidden 
                                            accept="image/*" 
                                            onChange={handleImageChange} 
                                            disabled={isSubmitting}
                                        />
                                    </Button>
                                    {errors.image && (
                                        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                                            {errors.image.message}
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Controller
                                    name="imageUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Image URL"
                                            {...field}
                                            onChange={handleUrlChange}
                                            error={!!errors.imageUrl}
                                            helperText={errors.imageUrl?.message}
                                            sx={{ mb: 1 }}
                                            disabled={isSubmitting}
                                        />
                                    )}
                                />
                            )}

                            {imagePreview && (
                                <Box
                                    component="img"
                                    src={imagePreview}
                                    alt="Preview"
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: 300,
                                        borderRadius: 2,
                                        mt: 2,
                                        objectFit: 'contain'
                                    }}
                                />
                            )}
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button 
                            color="inherit" 
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="inherit"
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                        >
                            {isSubmitting ? 'Creating...' : 'Save Product'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleAlertClose} 
                    severity={alert.severity}
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}