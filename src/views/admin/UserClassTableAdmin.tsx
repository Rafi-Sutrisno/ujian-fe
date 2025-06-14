'use client'

import * as React from 'react'

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
  Alert,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardContent,
  Snackbar
} from '@mui/material'

import { visuallyHidden } from '@mui/utils'
import { Delete } from '@mui/icons-material'

import TopSectionModal from '@/components/top-section/topsectionModal'
import AssignUserClassTable, { AssignUserTableRef } from '@components/Table/Admin/AssignUserTable'
import { fetchWithAuth } from '@/utils/api'
import TopSectionAssignUser from '@/components/top-section/topSectionAssignUser'

interface EditUserClassProps {
  id: string
}

interface Column {
  id: keyof Data | 'actions'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
}

interface Data {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  noid: string
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 180 },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'noid', label: 'NOID', minWidth: 130 },
  { id: 'actions', label: 'Actions', minWidth: 100 }
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

const UserClassTableAdmin: React.FC<EditUserClassProps> = ({ id }) => {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name')
  const [selected, setSelected] = React.useState<string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [rows, setRows] = React.useState<Data[]>([])

  const [open, setOpen] = React.useState(false)
  const [selectedData, setSelectedData] = React.useState<Data | null>(null)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedData(null)
    setOpen(false)
  }
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth(`/api/user_class/class/${id}`, undefined, 'GET')

      console.log(data)

      if (data.status) {
        const transformed = data.data.map(
          (result: any): Data => ({
            id: result.id,
            name: result.user.name, // nested access
            email: result.user.email, // nested access
            role: result.user.role_id === 1 ? 'admin' : 'user', // convert role_id to role label
            noid: result.user.noid
          })
        )
        console.log('update: ', transformed)
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

  const handleDeleteClick = async (id: string) => {
    console.log(id)
    try {
      const data = await fetchWithAuth(`/api/user_class/${id}`, undefined, 'DELETE')
      console.log('User removed:', data)
      if (data.status === false) {
        console.log(data)
        return setSnackbar({
          open: true,
          message: data?.message + ', error : ' + data?.error || 'Failed to remove user from class.',
          severity: 'error'
        })
      }

      console.log('User removed:', data)

      fetchData()

      setSnackbar({
        open: true,
        message: 'User removed from class successfully!',
        severity: 'success'
      })

      // Redirect or show confirmation
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while removing user.',
        severity: 'error'
      })
    }
    handleClose()
  }

  const sortedRows = rows.slice().sort(getComparator(order, orderBy))

  const assignUserTableRef = React.useRef<AssignUserTableRef>(null)

  const handleSave = () => {
    assignUserTableRef.current?.handleCreateMany()
  }

  const onSuccess = () => {
    fetchData()
    setSnackbar({
      open: true,
      message: 'Users Added to class successfully!',
      severity: 'success'
    })
  }

  const onError = (message?: string) => {
    setSnackbar({
      open: true,
      message: message || 'Failed to remove user from class.',
      severity: 'error'
    })
  }

  return (
    <>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <TopSectionAssignUser
            title='User Class Management'
            buttonText='Assign New User'
            modalContent={
              <AssignUserClassTable ref={assignUserTableRef} id={id} onSuccess={onSuccess} onError={onError} />
            }
            class_id={id}
            onSave={handleSave}
          />

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
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
                        {columns.map(column => {
                          console.log('ini column:', column)
                          const value = row[column.id as keyof Data]
                          console.log('ini value:', value)
                          if (column.id === 'actions') {
                            if (row.role === 'admin') return null
                            return (
                              <TableCell key={column.id} align={column.align ?? 'left'}>
                                <Button
                                  variant='outlined'
                                  size='small'
                                  color='error'
                                  onClick={() => {
                                    setSelectedData(row)
                                    setOpen(true)
                                  }}
                                >
                                  Delete
                                </Button>
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
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedData?.name} with NRP {selectedData?.noid}? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => selectedData && handleDeleteClick(selectedData.id)} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant='filled'
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default UserClassTableAdmin
