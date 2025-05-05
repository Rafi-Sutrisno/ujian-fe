'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Stack,
  Checkbox,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Box
} from '@mui/material'

import { Delete } from '@mui/icons-material'
import AddClassModal from '@/components/form/AddClassForm'
import { fetchWithAuth } from '@/utils/api'

interface Column {
  id: keyof Data | 'actions'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
}

interface Data {
  id: string
  name: string
  year: string
  class: string
  short_name: string
  created_at: string
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Class Name', minWidth: 180 },
  { id: 'year', label: 'Class Year', minWidth: 100 },
  { id: 'class', label: 'Class', minWidth: 100 },
  { id: 'short_name', label: 'Short Name', minWidth: 100 },
  { id: 'created_at', label: 'Created At', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 150 }
]

type Order = 'asc' | 'desc'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function EnhancedTableToolbar({ selected, onDelete }: { selected: string[]; onDelete: () => void }) {
  return (
    <Toolbar sx={{ pl: 2, pr: 1, bgcolor: selected.length > 0 ? 'action.selected' : 'inherit' }}>
      {selected.length > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1'>
          {selected.length} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle'>
          Classes Table
        </Typography>
      )}
      {selected.length > 0 && (
        <Tooltip title='Delete'>
          <IconButton onClick={onDelete}>
            <Delete />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

export default function ClassTableAdmin() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name')
  const [selected, setSelected] = React.useState<string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [open, setOpen] = React.useState(false)
  const [openModal, setOpenModal] = React.useState(false)
  const handleOpen = () => setOpenModal(true)
  const handleCloseAdd = () => setOpenModal(false)

  const [rows, setRows] = React.useState<Data[]>([])

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth(`/api/class/all`, undefined, 'GET')

      if (data.status) {
        const transformed = data.data.map(
          (result: any): Data => ({
            id: result.id,
            name: result.name,
            year: result.year,
            class: result.class,
            short_name: result.short_name,
            created_at: result.created_at
          })
        )
        setRows(transformed)
        // console.log('transformed:', transformed)
      } else {
        console.error('Failed to fetch classes:', data.message)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.id)
      setSelected(newSelected)
    } else {
      setSelected([])
    }
  }

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = [...selected]

    if (selectedIndex === -1) {
      newSelected.push(id)
    } else {
      newSelected.splice(selectedIndex, 1)
    }

    setSelected(newSelected)
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (id: string) => selected.includes(id)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleDeleteConfirm = () => {
    console.log(`Deleting ${selected.length} classes...`)
    setSelected([])
    setOpen(false)
  }

  const sortedRows = rows.slice().sort(getComparator(order, orderBy))

  return (
    <>
      <AddClassModal open={openModal} onClose={handleCloseAdd} onAdded={fetchData} />

      <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
        <Typography variant='h5' fontWeight='bold'>
          Class Management
        </Typography>
        <Button variant='contained' color='primary' onClick={handleOpen}>
          Add New Class
        </Button>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <EnhancedTableToolbar selected={selected} onDelete={handleClickOpen} />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align ?? 'left'}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {column.id !== 'actions' ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleRequestSort(column.id as keyof Data)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                const isItemSelected = isSelected(row.id)
                return (
                  <TableRow
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    onClick={() => handleClick(row.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox color='primary' checked={isItemSelected} />
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.class}</TableCell>
                    <TableCell>{row.short_name}</TableCell>
                    <TableCell>{row.created_at}</TableCell>
                    <TableCell align='center'>
                      <Stack direction='row' spacing={1} justifyContent='center'>
                        <Link href={`/admin/class/${row.id}`} passHref>
                          <Button variant='outlined' size='small' color='primary' onClick={e => e.stopPropagation()}>
                            View
                          </Button>
                        </Link>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Classes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selected.length} selected class(es)? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
