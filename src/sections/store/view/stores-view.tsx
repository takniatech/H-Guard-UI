import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useTable } from 'src/sections/user/view';
import { TableNoData } from 'src/sections/user/table-no-data';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';

import { StoreTableRow } from '../store-table-row';
import { StoreTableHead } from '../store-table-head';
import { StoreFormModal } from '../store-form-modal';
import { StoreTableToolbar } from '../store-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { StoreAssignAdminModal } from '../store-assign-admin-modal';

// ----------------------------------------------------------------------

function useBoolean(initial = false) {
  const [value, setValue] = useState(initial);
  const onTrue = useCallback(() => setValue(true), []);
  const onFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return { value, onTrue, onFalse, toggle };
}

export function StoreView() {
  const navigate = useNavigate();
  const table = useTable();
  const formModal = useBoolean();
  const assignModal = useBoolean();

  const [stores, setStores] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [currentStore, setCurrentStore] = useState<any>(null);
  const [filterName, setFilterName] = useState('');
  const [isCreatingStore, setIsCreatingStore] = useState(false);
  const [currentStoreId, setCurrentStoreId] = useState<number | null>(null);

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

  const dataFiltered = applyFilter({
    inputData: stores,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleEdit = (store: any) => {
    setCurrentStore(store);
    formModal.onTrue();
  };

  const handleAssingStore = (id: number) => {
    setCurrentStoreId(id);
    assignModal.onTrue();
    console.log('Assigning store with ID:', id);
  };

  const submitAdmins = (values: any[]) => {
    console.log('Submitting admins:', values);
    assignModal.onFalse();
  }

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

  const createStore = (form: any) => {
    setIsCreatingStore(true);
    fetch(`https://hgapi.takniatech.ae/api/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(() => {
        alert('Store created successfully');
        setIsCreatingStore(false);
        formModal.onFalse();
      })
      .catch(() => {
        alert('Error creating store');
        setIsCreatingStore(false);
      });
  };

  const updateStore = (form: any) => {
    setIsCreatingStore(true);
    fetch(`https://hgapi.takniatech.ae/api/stores/${form.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(() => {
        alert('Store updated successfully');
        setIsCreatingStore(false);
        formModal.onFalse();
      })
      .catch(() => {
        alert('Error updating store');
        setIsCreatingStore(false);
      });
  };

  const handleSubmit = (values: any) => {
    if (currentStore) {
      updateStore(values);
    } else {
      createStore(values);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
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
                      onAssignStore={() => handleAssingStore(row.id)}
                      onDeleteRow={() => handleDelete(row.id)}
                      onViewProducts={() => handleViewProducts(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    stores.length
                  )}
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
      
      <StoreAssignAdminModal open={assignModal.value} onClose={assignModal.onFalse} storeId={null} onSubmit={(e) => submitAdmins(e)} />
    </DashboardContent>
  );
}
