import type { Product } from 'src/interfaces/product';

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
    MenuItem,
    Snackbar,
    TextField,
    Typography,
    InputAdornment,
    CircularProgress,
} from '@mui/material';

import { uploadImage } from "src/sanity/client";
import { useGetProductCategoriesQuery } from 'src/api/productCategoryApi';
import { useCreateProductMutation, useUpdateProductMutation } from 'src/api/productApi';


const schema = yup.object().shape({
    name: yup.string().required('Product name is required'),
    nameAr: yup.string().required('Arabic name is required'),
    category: yup.string().required('Category is required'),
    medicineFamily: yup.string(),
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

type NewProductFormProps = {
    product?: Product;
    onUpdated?: () => void;
};

export default function NewProductForm({ product, onUpdated }: NewProductFormProps) {
    const { data: productCategories } = useGetProductCategoriesQuery();
    const [imagePreview, setImagePreview] = useState(product?.image || product?.imageUrl || '');
    const [activeTab, setActiveTab] = useState(product?.imageUrl ? 1 : 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [medicineFamilies, setMedicineFamilies] = useState([
        { value: 'Panadol', label: 'Panadol' },
        { value: 'Antihistamine', label: 'Antihistamine' },
        { value: 'Brufen', label: 'Brufen' },
        { value: 'Injection', label: 'Injection' },
        { value: 'Ointment', label: 'Ointment' },
        { value: 'Cream', label: 'Cream' },
        { value: 'Lotion', label: 'Lotion' },
        { value: 'Other', label: 'Other' },
    ]);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: product?.name || '',
            nameAr: product?.nameAr || '',
            category: product?.categoryId?.toLocaleString() || '',
            price: product?.price || 0,
            image: '',
            imageUrl: product?.imageUrl || product?.image || '',
            activeTab: product?.imageUrl ? 1 : 0,
            medicineFamily: product?.medicineFamily || '',
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
                nameAr: data.nameAr,
                price: data.price,
                medicineFamily: data.medicineFamily,
                categoryId: data.category,
                image: imageUrl,
                description: ""
            };

            if (product?.id) {
                await updateProduct({ ...productData, id: product.id, data: productData }).unwrap();
                setAlert({
                    open: true,
                    message: 'Product updated successfully!',
                    severity: 'success'
                });
                if (onUpdated) onUpdated();
            } else {
                await createProduct(productData).unwrap();
                setAlert({
                    open: true,
                    message: 'Product created successfully!',
                    severity: 'success'
                });
                reset();
                setImagePreview('');
                setActiveTab(0);
            }
        } catch (error) {
            console.error('Failed to submit product:', error);
            setAlert({
                open: true,
                message: product?.id ? 'Failed to update product' : 'Failed to create product',
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

    const handleAlertClose = () => {
        setAlert({...alert, open: false});
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {product ? "Edit Product" : "Add New Product"}
            </Typography>
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
                name="nameAr"
                control={control}
                render={({ field }) => (
                    <TextField
                        fullWidth
                        label="Arabic Name"
                        {...field}
                        error={!!errors.nameAr}
                        helperText={errors.nameAr?.message}
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
                        {productCategories?.map(option => (
                            <MenuItem key={option.value} value={option.value.toString()}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            />

            {productCategories?.find((category: Category) => category.value.toString() === control._formValues.category)?.label === 'medicine' && (
                <Controller
                    name="medicineFamily"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            select
                            fullWidth
                            label="medicineFamily"
                            {...field}
                            error={!!errors.medicineFamily}
                            helperText={errors.medicineFamily?.message}
                            sx={{ mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {medicineFamilies.map(option => (
                                <MenuItem key={option.value} value={option.value.toString()}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />
            )}

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

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="inherit"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                    {isSubmitting ? (product ? 'Updating...' : 'Creating...') : (product ? 'Update Product' : 'Save Product')}
                </Button>
                <Button 
                    color="inherit" 
                    onClick={() => {
                        reset();
                        setImagePreview(product?.image || product?.imageUrl || '');
                        setActiveTab(product?.imageUrl ? 1 : 0);
                    }}
                    disabled={isSubmitting}
                >
                    Reset
                </Button>
            </Box>

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
        </Box>
    );
}