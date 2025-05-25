'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Box,
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
  DialogContentText
} from '@mui/material'

import { visuallyHidden } from '@mui/utils'
import { Delete } from '@mui/icons-material'
import AddUserModal from '@/components/form/AddUserForm'
import { fetchWithAuth } from '@/utils/api'
import AddUserUploadModal from '@/components/form/AddUserUpload'

interface Column {
  id: keyof Data | 'actions'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
}

interface Data {
  id: string
  username: string
  name: string
  email: string
  role: 'admin' | 'user'
  noid: string
  created_at: string
}

const columns: readonly Column[] = [
  { id: 'username', label: 'Username', minWidth: 150 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 180 },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'noid', label: 'NOID', minWidth: 130 },
  { id: 'created_at', label: 'Created At', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' }
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
          Users Table
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

export default function UserTableAdmin() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name')
  const [selected, setSelected] = React.useState<string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [openModal, setOpenModal] = React.useState(false)
  const handleOpen = () => setOpenModal(true)
  const handleCloseAdd = () => setOpenModal(false)

  const [rows, setRows] = React.useState<Data[]>([])

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth('/api/user/all', undefined, 'GET')

      if (data.status) {
        const transformed = data.data.map(
          (user: any): Data => ({
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role_id === 1 ? 'admin' : 'user',
            noid: user.noid,
            created_at: user.created_at
          })
        )
        setRows(transformed)
      } else {
        console.error('Failed to fetch users:', data.message)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
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
      return
    }
    setSelected([])
  }

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [openUploadModal, setOpenUploadModal] = React.useState(false)

  const handleOpenUpload = () => setOpenUploadModal(true)
  const handleCloseUpload = () => setOpenUploadModal(false)

  const handleDeleteConfirm = () => {
    // logic for actual deletion goes here
    console.log(`Deleting ${selected.length} users...`)
    setSelected([])
    setOpen(false)
  }

  const sortedRows = rows.slice().sort(getComparator(order, orderBy))

  return (
    <>
      <AddUserModal open={openModal} onClose={handleCloseAdd} onUserAdded={fetchData} />
      <AddUserUploadModal open={openUploadModal} onClose={handleCloseUpload} onUploadSuccess={fetchData} />
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
        <Typography variant='h5' fontWeight='bold'>
          User Management
        </Typography>
        <Box display='flex' justifyContent='start' gap={2} alignItems='center' mb={4}>
          <Button variant='outlined' color='secondary' onClick={handleOpenUpload}>
            Upload Users File
          </Button>
          <Button variant='contained' color='primary' onClick={handleOpen}>
            Add New User
          </Button>
        </Box>
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
                    sortDirection={orderBy === column.id ? order : false}
                    align={column.align ?? 'left'}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.id !== 'actions' && column.id !== 'id' ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleRequestSort(column.id as keyof Data)}
                      >
                        {column.label}
                        {orderBy === column.id ? (
                          <Box component='span' sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
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
                    {columns.map(column => {
                      const value = row[column.id as keyof Data]
                      if (column.id === 'actions') {
                        return (
                          <TableCell key={column.id} align={column.align ?? 'left'}>
                            <Stack direction='row' spacing={1} justifyContent='center'>
                              <Link href={`/admin/user/${row.id}`} passHref>
                                <Button
                                  variant='outlined'
                                  size='small'
                                  color='primary'
                                  onClick={e => e.stopPropagation()}
                                >
                                  View
                                </Button>
                              </Link>
                            </Stack>
                          </TableCell>
                        )
                      }
                      return (
                        <TableCell key={column.id} align={column.align ?? 'left'}>
                          {value}
                        </TableCell>
                      )
                    })}
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
        <DialogTitle>Delete Users</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selected.length} selected user(s)? This action cannot be undone.
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
