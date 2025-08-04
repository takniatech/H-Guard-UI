// import Papa from 'papaparse';
// import { useState } from 'react';

// import {
//   Box,
//   Alert,
//   Button,
//   Dialog,
//   Typography,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from '@mui/material';

// import { Iconify } from 'src/components/iconify';

// interface ProductCSV {
//   name: string;
//   description: string;
//   category: string;
//   price: string;
//   image: string; // URL
// }

// export default function ProductBulkImport() {
//   const [open, setOpen] = useState(false);
//   const [importedData, setImportedData] = useState<ProductCSV[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const handleOpen = () => {
//     setImportedData([]);
//     setError(null);
//     setOpen(true);
//   };
//   const handleClose = () => setOpen(false);

//   const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     Papa.parse<ProductCSV>(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         const parsedData = results.data.map(row => ({
//           ...row,
//           price: parseFloat(row.price || '0'),
//         }));

//         const isValid = parsedData.every(item =>
//           item.name && item.description && item.category && item.price > 0 && item.image
//         );

//         if (!isValid) {
//           setError('Some rows have missing or invalid data.');
//           setImportedData([]);
//         } else {
//           setImportedData(parsedData);
//           setError(null);
//         }
//       },
//       error: () => {
//         setError('Failed to parse the CSV file.');
//         setImportedData([]);
//       },
//     });
//   };

//   const handleImport = async () => {
//     try {
//       // Replace with actual API call to save imported products
//       console.log('Importing:', importedData);
//       setOpen(false);
//     } catch (err) {
//       setError('Failed to import data.');
//     }
//   };

//   return (
//     <>
//       <Button
//         variant="outlined"
//         color="primary"
//         startIcon={<Iconify icon="carbon:csv" />}
//         onClick={handleOpen}
//         sx={{ ml: 2 }}
//       >
//         Bulk Import
//       </Button>

//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle>Import Products from CSV</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" gutterBottom>
//             Upload a CSV file with the following headers:
//             <br />
//             <strong>name, description, category, price, image</strong>
//             <br />
//             Image should be a valid URL.
//           </Typography>

//           <Button variant="outlined" component="label" sx={{ mt: 2 }}>
//             Upload CSV
//             <input type="file" hidden accept=".csv" onChange={handleCSVUpload} />
//           </Button>

//           {error && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {error}
//             </Alert>
//           )}

//           {importedData.length > 0 && (
//             <Box mt={2}>
//               <Typography variant="subtitle2">
//                 {importedData.length} product(s) ready for import.
//               </Typography>
//             </Box>
//           )}
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button
//             variant="contained"
//             disabled={importedData.length === 0}
//             onClick={handleImport}
//           >
//             Import
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }
