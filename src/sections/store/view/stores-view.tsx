import { useState, useCallback, use, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useBoolean } from 'minimal-shared/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { emptyRows, applyFilter, getComparator } from '../utils';

import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField } from '@mui/material';
import { useTable } from 'src/sections/user/view';
import { StoreTableHead } from '../store-table-head';
import { StoreTableToolbar } from '../store-table-toolbar';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { TableNoData } from 'src/sections/user/table-no-data';
import { StoreTableRow } from '../store-table-row';import { StoreFormModal } from '../store-form-modal';



// Mock data - replace with your actual API calls
// const stores = [
//   {
//     id: '1',
//     name: 'Downtown Pharmacy',
//     email: 'test@gmail.com',
//     website: 'www.example.com',
//     logo: 'https://fastly.picsum.photos/id/558/200/200.jpg?hmac=tFHyh9KzOASFBog3Hpj6oSkBkBr90f67Yuejl0XnFDM',
//     address: '123 Main St, New York, NY',
//     phone: '(212) 555-1234',
//     status: 'active',
//     products: 45,
//   },
//   {
//     id: '2',
//     name: 'Health Plus',
//     email: 'test@gmail.com',
//     website: 'www.example.com',
//     logo: 'https://fastly.picsum.photos/id/558/200/200.jpg?hmac=tFHyh9KzOASFBog3Hpj6oSkBkBr90f67Yuejl0XnFDM',
//     address: '456 Oak Ave, Chicago, IL',
//     phone: '(312) 555-5678',
//     status: 'active',
//     products: 32,
//   },
//   {
//     id: '3',
//     name: 'MediCare',
//     email: 'test@gmail.com',
//     website: 'www.example.com',
//     logo: 'https://fastly.picsum.photos/id/558/200/200.jpg?hmac=tFHyh9KzOASFBog3Hpj6oSkBkBr90f67Yuejl0XnFDM',
//     address: '789 Pine Rd, Los Angeles, CA',
//     phone: '(213) 555-9012',
//     status: 'inactive',
//     products: 28,
//   },
// ];

// ----------------------------------------------------------------------

export function StoreView() {
  const navigate = useNavigate();
  const table = useTable();
  const formModal = useBoolean();
  const [stores, setStores] = useState<any[]>([]);
  const [currentStore, setCurrentStore] = useState<any>(null);
  const [filterName, setFilterName] = useState('');
  const [isCreatingStore, setIsCreatingStore] = useState(false);

  const dataFiltered = applyFilter({
    inputData: stores,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  useEffect(() => {
    fetch('https://hgapi.takniatech.ae/api/stores')
      .then((response) => response.json())
      .then((data) => {
        setStores(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  const notFound = !dataFiltered.length && !!filterName;

  const handleEdit = (store: any) => {
    setCurrentStore(store);
    formModal.onTrue();
  };

  const handleAdd = () => {
    setCurrentStore(null);
    formModal.onTrue();
  };

  const handleDelete = (id: string) => {
    console.log('Deleting store with ID:', id);
  };

  const handleViewProducts = (id: string) => {
    navigate(`/dashboard/stores/${id}/products`);
  };

  const createStore =  (form: any) => {
    setIsCreatingStore(true);
    fetch(`https://hgapi.takniatech.ae/api/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    }).then(() => {
      alert('Store created successfully');
      setIsCreatingStore(false);
      formModal.onFalse();
    }).catch(() => {
      alert('Error creating store');
      setIsCreatingStore(false);
    });
  }

  const updateStore = (form: any) => {
    setIsCreatingStore(true);
    fetch(`https://hgapi.takniatech.ae/api/stores/${form.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    }).then(() => {
      alert('Store updated successfully');
      setIsCreatingStore(false);
      formModal.onFalse();
    }).catch(() => {
      alert('Error updating store');
      setIsCreatingStore(false);
    });
  }


  const handleSubmit = (values: any) => {
    if (currentStore) {
      updateStore(values);
      console.log('Updating store:', values);
    } else {
      createStore(values);
      console.log('Adding new store:', values);
    }
    formModal.onFalse();
  };

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Stores
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
        >
          New Store
        </Button>
      </Box>

      <Card>
        <StoreTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <StoreTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={stores.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    stores.map((store) => store.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'address', label: 'Address' },
                  { id: 'email', label: 'Email' },
                  { id: 'website', label: 'Website' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'description', label: 'Description' },
                  { id: 'logo', label: 'Logo', align: 'center' },
                  { id: 'actions', label: 'Actions', align: 'right' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <StoreTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEditRow={() => handleEdit(row)}
                      onDeleteRow={() => handleDelete(row.id)}
                      onViewProducts={() => handleViewProducts(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, stores.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={stores.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <StoreFormModal
        open={formModal.value}
        onClose={formModal.onFalse}
        store={currentStore}
        onSubmit={handleSubmit}
      />
    </DashboardContent>
  );
}