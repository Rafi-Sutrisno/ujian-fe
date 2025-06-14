'use client'

import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import Box from '@mui/material/Box'
import { Card, CardContent, CardHeader, Stack, Grid, TextField, Snackbar, Alert } from '@mui/material'
import Link from 'next/link'
import TopSectionModal from '@/components/top-section/topsectionModal'
import EditorBasic from '@/components/Editor/EditorBasic'
import { fetchWithAuth } from '@/utils/api'

interface SessionTableProps {
  exam_id: string
}

interface Column {
  id: keyof Data | 'action'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
  sortable?: boolean
}

interface Data {
  id: string
  name: string
  no_id: string
  ip_address: string
  user_agent: string
  device: string
  status: string
  finished_at: string
  created_at: string
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 150, sortable: true },
  { id: 'no_id', label: 'Nrp', minWidth: 100, sortable: true },
  { id: 'ip_address', label: 'Ip Address', minWidth: 100, sortable: true },
  { id: 'user_agent', label: 'Agent Info', minWidth: 150, sortable: true },
  { id: 'device', label: 'Device', minWidth: 100, sortable: true },
  { id: 'status', label: 'Status', minWidth: 100, sortable: true },
  { id: 'finished_at', label: 'Finished At', minWidth: 120, sortable: true },
  { id: 'created_at', label: 'Created At', minWidth: 120, sortable: true },
  { id: 'action', label: 'Action', minWidth: 120 }
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

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  return array
    .map((el, index) => [el, index] as [T, number])
    .sort((a, b) => {
      const cmp = comparator(a[0], b[0])
      if (cmp !== 0) return cmp
      return a[1] - b[1]
    })
    .map(el => el[0])
}

const SessionTableAdmin: React.FC<SessionTableProps> = ({ exam_id }) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('id')
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const [rows, setRows] = React.useState<Data[]>([])

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth(`/api/exam_session/byexamid/${exam_id}`, undefined, 'GET')

      console.log(data)

      if (data.status) {
        if (data.data) {
          const transformed = data.data.map(
            (result: any): Data => ({
              id: result.id,
              name: result.user.name,
              no_id: result.user.noid,
              ip_address: result.ip_address,
              user_agent: result.user_agent,
              device: result.device,
              status: result.status === 0 ? 'not finished' : 'finished',
              finished_at: result.status === 1 ? result.finished_at : '-',
              created_at: result.created_at
            })
          )
          setRows(transformed)
        }

        // console.log('transformed:', transformed)
      } else {
        console.error('Failed to fetch sessions:', data.message)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
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

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleDeleteClick = (id: string) => {
    setSelectedId(id)
    setOpenDialog(true)
  }

  const handleDelete = async () => {
    // console.log('Problem Deleted:', formData.input_data)
    try {
      const data = await fetchWithAuth(`/api/exam_session/${selectedId}`, undefined, 'DELETE')

      if (data.status === false) {
        console.log(data)
        return setSnackbar({
          open: true,
          message: data?.message || 'Failed to delete sessions.',
          severity: 'error'
        })
      }

      console.log('Sessions deleted:', data)
      fetchData()
      setSnackbar({
        open: true,
        message: 'Sessions deleted successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while deleting session.',
        severity: 'error'
      })
    }
    setOpenDialog(false)
  }

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  return (
    <Card sx={{ mt: 4 }}>
      <CardHeader title='Exam Session Table' />
      <CardContent>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label='Exam Session table'>
              <TableHead>
                <TableRow>
                  {columns?.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align ?? 'left'}
                      style={{ minWidth: column.minWidth }}
                      sortDirection={orderBy === column.id ? order : false}
                    >
                      {column.sortable ? (
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
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                      {columns.map(column => {
                        if (column.id === 'action') {
                          return (
                            <TableCell key={column.id} align={column.align ?? 'left'}>
                              <Stack direction='row' spacing={2}>
                                <Button
                                  variant='outlined'
                                  size='small'
                                  color='error'
                                  onClick={() => handleDeleteClick(row.id)}
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </TableCell>
                          )
                        }
                        const value = row[column.id as keyof Data]
                        return (
                          <TableCell key={column.id} align={column.align ?? 'left'}>
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
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
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Are you sure you want to remove this session?</DialogTitle>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button color='error' onClick={handleDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </CardContent>
    </Card>
  )
}

export default SessionTableAdmin
