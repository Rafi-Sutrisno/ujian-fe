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
import { Card, CardContent, Grid, MenuItem, Stack, Snackbar, Alert } from '@mui/material'
import TextField from '@mui/material/TextField'
import Link from 'next/link'
import TopSectionModal from '@/components/top-section/topsectionModal'
import { fetchWithAuth } from '@/utils/api'

interface ExamTableProps {
  class_id: string
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
  short_name: string
  is_published: boolean
  start_time: string
  duration: string
  end_time: string
  created_at: string
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 150, sortable: true },
  { id: 'short_name', label: 'Short Name', minWidth: 120, sortable: true },
  { id: 'is_published', label: 'Published', minWidth: 100, sortable: true },
  { id: 'start_time', label: 'Start Time', minWidth: 170, sortable: true },
  { id: 'duration', label: 'Duration', minWidth: 120 },
  { id: 'end_time', label: 'End Time', minWidth: 170 },
  { id: 'created_at', label: 'Created At', minWidth: 170, sortable: true },
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

const ExamTableAdmin: React.FC<ExamTableProps> = ({ class_id }) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('id')
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const [rows, setRows] = React.useState<Data[]>([])

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth(`/api/exam/byclass/${class_id}`, undefined, 'GET')

      if (data.status) {
        const transformed = data.data.map(
          (result: any): Data => ({
            id: result.id,
            name: result.name, // nested access
            short_name: result.short_name,
            is_published: result.is_published,
            start_time: result.start_time,
            duration: result.duration,
            end_time: result.end_time,
            created_at: result.created_at
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

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleConfirmDelete = () => {
    // perform delete logic here
    console.log('Delete ID:', selectedId)
    setOpenDialog(false)
    setSelectedId(null)
  }

  const [formData, setFormData] = React.useState({
    name: '',
    short_name: '',
    is_published: true,
    start_time: '',
    duration: '',
    end_time: ''
  })

  const [hours, setHours] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      duration: `${hours}h${minutes}m${seconds}s`
    }))
  }, [hours, minutes, seconds])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatExamData = (data: typeof formData) => {
    // Convert is_published to actual boolean

    // Append timezone manually if it's missing
    let start_time = data.start_time
    if (!start_time.includes('+')) {
      start_time += ':00+07:00' // or use dynamic TZ if needed
    }

    // Keep duration as-is (assuming user types valid Go duration string)
    const duration = data.duration

    return {
      ...data,
      start_time,
      duration
    }
  }

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const handleSubmit = async () => {
    const formattedData = formatExamData(formData)
    console.log('data:', formattedData)
    const { name, short_name, is_published, start_time, duration } = formattedData
    console.log('data: ', name, short_name, is_published, start_time, duration)

    if (!name || !short_name || is_published === null || is_published === undefined || !start_time || !duration) {
      console.log('all field required')
      return setSnackbar({
        open: true,
        message: 'All fields cant be null.',
        severity: 'error'
      })
    }

    try {
      const payload = { class_id, name, short_name, is_published, start_time, duration }

      const data = await fetchWithAuth(`/api/exam/create`, payload, 'POST')

      if (data.status === false) {
        console.log(data)
        return setSnackbar({
          open: true,
          message: data?.message || 'Failed to create exam.',
          severity: 'error'
        })
      }

      console.log('Exam created:', data)
      fetchData()
      setSnackbar({
        open: true,
        message: 'Exam created successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while creating exam.',
        severity: 'error'
      })
    }
  }

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <TopSectionModal
          title='Exam List'
          buttonText='Add New Exam'
          modalContent={
            <CardContent>
              <form>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField fullWidth label='Name' name='name' value={formData.name} onChange={handleChange} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Short Name'
                      name='short_name'
                      value={formData.short_name}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.is_published}
                            onChange={e =>
                              setFormData(prev => ({
                                ...prev,
                                is_published: e.target.checked
                              }))
                            }
                            name='is_published'
                          />
                        }
                        label='Published'
                      />
                    </Grid> */}

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Published'
                      name='is_published'
                      select
                      value={formData.is_published ? 'true' : 'false'}
                      onChange={e => setFormData(prev => ({ ...prev, is_published: e.target.value === 'true' }))}
                    >
                      <MenuItem value='true'>Yes</MenuItem>
                      <MenuItem value='false'>No</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type='datetime-local'
                      label='Start Time'
                      name='start_time'
                      value={formData.start_time}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          start_time: e.target.value
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <p>Duration:</p>
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type='number'
                      label='Hours'
                      value={hours}
                      onChange={e => setHours(parseInt(e.target.value) || 0)}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type='number'
                      label='Minutes'
                      value={minutes}
                      onChange={e => setMinutes(parseInt(e.target.value) || 0)}
                      InputProps={{ inputProps: { min: 0, max: 59 } }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type='number'
                      label='Seconds'
                      value={seconds}
                      onChange={e => setSeconds(parseInt(e.target.value) || 0)}
                      InputProps={{ inputProps: { min: 0, max: 59 } }}
                    />
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          }
          onSave={handleSubmit}
        />
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label='exam table'>
              <TableHead>
                <TableRow>
                  {columns.map(column => (
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
                                <Link href={`/admin/exam/${row.id}`} passHref>
                                  <Button variant='outlined' size='small' color='primary'>
                                    View
                                  </Button>
                                </Link>
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
            <DialogTitle>Are you sure you want to delete this exam?</DialogTitle>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button color='error' onClick={handleConfirmDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </CardContent>{' '}
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
    </Card>
  )
}

export default ExamTableAdmin
