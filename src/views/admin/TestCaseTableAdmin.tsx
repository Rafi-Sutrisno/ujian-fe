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
import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { Card, CardContent, Grid, Snackbar, Alert } from '@mui/material'
import TopSectionModal from '@/components/top-section/topsectionModal'
import { fetchWithAuth } from '@/utils/api'

interface TestCaseTableProps {
  problem_id: string
}

interface Column {
  id: 'test_case' | 'created_at' | 'actions'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
}

const columns: readonly Column[] = [
  { id: 'test_case', label: 'Test Case', minWidth: 450 },
  { id: 'created_at', label: 'Created At', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 150 }
]

interface Data {
  id: string
  input_data: string
  expected_output: string
  created_at: string
}

const TestCaseTableAdmin: React.FC<TestCaseTableProps> = ({ problem_id }) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [openEditDialog, setOpenEditDialog] = React.useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [currentRow, setCurrentRow] = React.useState<Data | null>(null)

  const [rows, setRows] = React.useState<Data[]>([])

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth(`/api/testcase/problem/${problem_id}`, undefined, 'GET')

      console.log(data)

      if (data.status) {
        if (data.data) {
          const transformed = data.data.map(
            (result: any): Data => ({
              id: result.id,
              input_data: result.input_data,
              expected_output: result.expected_output,
              created_at: result.created_at
            })
          )
          setRows(transformed)
        }

        // console.log('transformed:', transformed)
      } else {
        console.error('Failed to fetch test cases:', data.message)
      }
    } catch (error) {
      console.error('Error fetching test cases:', error)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const [formData, setFormData] = React.useState({
    input_data: '',
    expected_output: ``
  })

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitPost = async () => {
    const { input_data, expected_output } = formData
    console.log('data: ', formData)

    if (!input_data || !expected_output) {
      console.log('all field required')
      return setSnackbar({
        open: true,
        message: 'All fields cant be null.',
        severity: 'error'
      })
    }

    try {
      const payload = { problem_id, input_data, expected_output }
      const result = await fetchWithAuth(`/api/testcase/`, payload, 'POST')

      if (result.status === false) {
        console.log(result)
        return setSnackbar({
          open: true,
          message: result?.message || 'Failed to create test case.',
          severity: 'error'
        })
      }

      console.log('Test Case created:', result)
      fetchData()
      setSnackbar({
        open: true,
        message: 'Test Case created successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while creating test case.',
        severity: 'error'
      })
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleEditOpen = (row: Data) => {
    setCurrentRow(row)
    setFormData({
      input_data: row.input_data,
      expected_output: row.expected_output
    })
    setOpenEditDialog(true)
  }

  const handleEditClose = () => {
    setOpenEditDialog(false)
    setFormData({
      input_data: '',
      expected_output: ``
    })
  }

  const handleSaveEdit = async () => {
    const { input_data, expected_output } = formData
    console.log('data: ', input_data, expected_output)

    if (!input_data || !expected_output) {
      console.log('all field required')
      return setSnackbar({
        open: true,
        message: 'All fields cant be null.',
        severity: 'error'
      })
    }

    try {
      const payload = { input_data, expected_output }
      const data = await fetchWithAuth(`/api/testcase/${currentRow?.id}`, payload, 'PATCH')

      if (data.status === false) {
        console.log(data)
        return setSnackbar({
          open: true,
          message: data?.message || 'Failed to update test case.',
          severity: 'error'
        })
      }

      console.log('Test Case updated:', data)
      fetchData()
      setSnackbar({
        open: true,
        message: 'Test Case updated successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while updating test Case.',
        severity: 'error'
      })
    }
    setOpenEditDialog(false)
  }

  const handleDeleteOpen = (row: Data) => {
    setCurrentRow(row)
    setOpenDeleteDialog(true)
  }

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false)
  }

  const handleDelete = async () => {
    // console.log('Problem Deleted:', formData.input_data)
    try {
      const data = await fetchWithAuth(`/api/testcase/${currentRow?.id}`, undefined, 'DELETE')

      if (data.status === false) {
        console.log(data)
        return setSnackbar({
          open: true,
          message: data?.message || 'Failed to delete test case.',
          severity: 'error'
        })
      }

      console.log('Test Case deleted:', data)
      fetchData()
      setSnackbar({
        open: true,
        message: 'Test Case deleted successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while updating test case.',
        severity: 'error'
      })
    }
    setOpenDeleteDialog(false)
  }

  return (
    <>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <TopSectionModal
            recv={false}
            title='Test Case List'
            buttonText='Add New Test Case'
            modalContent={
              <>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Input Data'
                      name='input_data'
                      value={formData.input_data}
                      onChange={handleChange}
                      multiline
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Expected Output'
                      name='expected_output'
                      value={formData.expected_output}
                      onChange={handleChange}
                      multiline
                    />
                  </Grid>
                </Grid>
              </>
            }
            onSave={handleSubmitPost}
          />
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='test case table'>
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell key={column.id} align={column.align ?? 'left'} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                      {columns.map(column => {
                        if (column.id === 'test_case') {
                          return (
                            <TableCell key={column.id} align={column.align ?? 'left'}>
                              Test Case {page * rowsPerPage + index + 1}
                            </TableCell>
                          )
                        } else if (column.id === 'actions') {
                          return (
                            <TableCell key={column.id} align={column.align ?? 'left'}>
                              <Stack direction='row' spacing={2}>
                                <Button
                                  variant='outlined'
                                  size='small'
                                  color='primary'
                                  onClick={() => handleEditOpen(row)}
                                >
                                  Edit
                                </Button>

                                <Button
                                  variant='outlined'
                                  size='small'
                                  color='error'
                                  onClick={() => handleDeleteOpen(row)}
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </TableCell>
                          )
                        } else {
                          const value = row[column.id as keyof Data]
                          return (
                            <TableCell key={column.id} align={column.align ?? 'left'}>
                              {value}
                            </TableCell>
                          )
                        }
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

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={handleEditClose}>
          <DialogTitle>Edit Test Case</DialogTitle>
          <DialogContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Input Data'
                  name='input_data'
                  value={formData.input_data}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Expected Output'
                  name='expected_output'
                  value={formData.expected_output}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color='secondary'>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color='primary'>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogActions>
            <Button onClick={handleDeleteClose} color='secondary'>
              Cancel
            </Button>
            <Button onClick={handleDelete} color='error'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
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

export default TestCaseTableAdmin
