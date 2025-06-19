import React, { useRef, useState } from 'react';
import { Checkbox, TableCell, TableRow, Typography, Button, Tooltip, Popover, MenuList, MenuItem, menuItemClasses, IconButton } from '@mui/material';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

type Props = {
  row: any;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onViewProducts: VoidFunction;
};

export function StoreTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onViewProducts,
}: Props) {
  const [openPopover, setOpenPopover] = useState<null | HTMLElement>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2">{row.name}</Typography>
      </TableCell>

      <TableCell>{row.address}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.website}</TableCell>

      <TableCell>{row.phone}</TableCell>

      <TableCell>
        <Label color={row.status === 'active' ? 'success' : 'error'}>
          {row.status}
        </Label>
      </TableCell>

      <TableCell align="center"><image href={row.logo} height={30} width={30} /></TableCell>

      <TableCell align="right">
        <IconButton onClick={handleOpenPopover}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
        <Popover
          open={!!openPopover}
          anchorEl={openPopover}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuList
            disablePadding
            sx={{
              p: 0.5,
              gap: 0.5,
              width: 140,
              display: 'flex',
              flexDirection: 'column',
              [`& .${menuItemClasses.root}`]: {
                px: 1,
                gap: 2,
                borderRadius: 0.75,
                [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleClosePopover();
                onEditRow();
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleClosePopover();
                onDeleteRow();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </MenuList>
        </Popover>
      </TableCell>
    </TableRow>
  );
}