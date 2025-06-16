'use client'

import * as React from 'react'

import Link from 'next/link'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import Box from '@mui/material/Box'
import { Card, CardContent, Stack, Grid, TextField, Snackbar, Alert } from '@mui/material'

import TopSectionModal from '@/components/top-section/topsectionModal'
import EditorBasic from '@/components/Editor/EditorBasic'
import { fetchWithAuth } from '@/utils/api'

interface Column {
  id: keyof Data | 'action'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
  sortable?: boolean
}

interface Data {
  id: string
  title: string
  created_at: string
}

const columns: readonly Column[] = [
  { id: 'title', label: 'Title', minWidth: 500, sortable: true },
  { id: 'created_at', label: 'Created At', minWidth: 150, sortable: true },
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

const ProblemTableAdmin = () => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('id')

  // const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const [rows, setRows] = React.useState<Data[]>([])

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth(`/api/problem/`, undefined, 'GET')

      // console.log(data)

      if (data.status) {
        if (data.data) {
          const transformed = data.data.map(
            (result: any): Data => ({
              id: result.id,
              title: result.title,
              created_at: result.created_at
            })
          )

          setRows(transformed)
        }

        // // console.log('transformed:', transformed)
      } else {
        console.error('Failed to fetch problems:', data.message)
      }
    } catch (error) {
      console.error('Error fetching problems:', error)
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

  // const handleConfirmDelete = () => {
  //   // perform delete logic here
  //   // console.log('Delete ID:', selectedId)
  //   setOpenDialog(false)
  //   setSelectedId(null)
  // }

  const [formData, setFormData] = React.useState({
    title: '',
    description: ``,
    constraints: ``,
    sample_input: ``,
    sample_output: ``,
    cpu_time_limit: '',
    memory_limit: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const handleSubmit = async () => {
    const { title, description, constraints, sample_input, sample_output, cpu_time_limit, memory_limit } = formData

    // console.log('data: ', formData)

    if (!title || !description || !constraints || !sample_input || !sample_output) {
      // console.log('all field required')

      return setSnackbar({
        open: true,
        message: 'All fields cant be null.',
        severity: 'error'
      })
    }

    try {
      const payload: any = { title, description, constraints, sample_input, sample_output }

      if (cpu_time_limit !== '') {
        payload.cpu_time_limit = parseFloat(cpu_time_limit)
      }

      if (memory_limit !== '') {
        payload.memory_limit = parseInt(memory_limit)
      }

      const result = await fetchWithAuth(`/api/problem/`, payload, 'POST')

      if (result.status === false) {
        // console.log(result)

        return setSnackbar({
          open: true,
          message: result?.message || 'Failed to create problem.',
          severity: 'error'
        })
      }

      // console.log('Problem created:', result)
      fetchData()
      setSnackbar({
        open: true,
        message: 'Problem created successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while creating problem.',
        severity: 'error'
      })
    }
  }

  const handleEditorChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <TopSectionModal
          title='Problem List'
          buttonText='Add New Problem'
          modalContent={
            <CardContent>
              <form>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField fullWidth label='Title' name='title' value={formData.title} onChange={handleChange} />
                  </Grid>

                  <Grid item xs={12}>
                    <p>Description</p>
                    <EditorBasic name='description' content={formData.description} onChange={handleEditorChange} />
                  </Grid>

                  <Grid item xs={12}>
                    <p>Constraints</p>
                    <EditorBasic name='constraints' content={formData.constraints} onChange={handleEditorChange} />
                  </Grid>

                  <Grid item xs={12}>
                    <p>Sample Input</p>
                    <EditorBasic name='sample_input' content={formData.sample_input} onChange={handleEditorChange} />
                  </Grid>

                  <Grid item xs={12}>
                    <p>Sample Output</p>
                    <EditorBasic name='sample_output' content={formData.sample_output} onChange={handleEditorChange} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label='CPU Time Limit (seconds - Optional)'
                      name='cpu_time_limit'
                      type='number'
                      value={formData.cpu_time_limit}
                      onChange={e => handleEditorChange('cpu_time_limit', e.target.value)}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label='Memory Limit (kylobyte - Optional)'
                      name='memory_limit'
                      type='number'
                      value={formData.memory_limit}
                      onChange={e => handleEditorChange('memory_limit', e.target.value)}
                      fullWidth
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
            <Table stickyHeader aria-label='problem table'>
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
                                <Link href={`/admin/problem/${row.id}`} passHref>
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
        </Paper>
      </CardContent>
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

export default ProblemTableAdmin
