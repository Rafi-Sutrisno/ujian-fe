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

interface Column {
  id: 'no' | 'name' | 'year' | 'class' | 'created_at' | 'actions'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
}

const columns: readonly Column[] = [
  { id: 'no', label: 'No', minWidth: 50 },
  { id: 'name', label: 'Class Name', minWidth: 180 },
  { id: 'year', label: 'Class Year', minWidth: 100 },
  { id: 'class', label: 'Class', minWidth: 100 },
  { id: 'created_at', label: 'Created At', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 150 }
]

interface ClassData {
  name: string
  year: string
  class: string
  created_at: string
}

function createClassData(name: string, year: string, className: string, created_at: string): ClassData {
  return { name, year, class: className, created_at }
}

// Sample class data
const rows: ClassData[] = [
  createClassData('Informatics Engineering', '2021', 'A', '2025-04-01 09:00:00'),
  createClassData('Information Systems', '2021', 'B', '2025-04-01 09:10:00'),
  createClassData('Computer Engineering', '2021', 'C', '2025-04-01 09:20:00'),
  createClassData('Data Science', '2021', 'D', '2025-04-02 10:00:00'),
  createClassData('Software Engineering', '2021', 'E', '2025-04-02 10:15:00'),
  createClassData('Cybersecurity', '2021', 'F', '2025-04-02 11:30:00'),
  createClassData('Artificial Intelligence', '2021', 'G', '2025-04-03 13:00:00'),
  createClassData('Multimedia', '2021', 'H', '2025-04-03 14:00:00'),
  createClassData('Human-Computer Interaction', '2021', 'I', '2025-04-03 15:00:00'),
  createClassData('Embedded Systems', '2021', 'J', '2025-04-04 16:00:00')
]

export default function ClassTable() {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleEdit = (row: ClassData) => {
    console.log('Edit clicked:', row)
    // Add your edit logic here
  }

  const handleDelete = (row: ClassData) => {
    console.log('Delete clicked:', row)
    // Add your delete logic here
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='class table'>
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
                  if (column.id === 'no') {
                    return (
                      <TableCell key={column.id} align={column.align ?? 'left'}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                    )
                  } else if (column.id === 'actions') {
                    return (
                      <TableCell key={column.id} align={column.align ?? 'left'}>
                        <Stack direction='row' spacing={1}>
                          <Button variant='outlined' size='small' color='primary' onClick={() => handleEdit(row)}>
                            Edit
                          </Button>
                          <Button variant='outlined' size='small' color='error' onClick={() => handleDelete(row)}>
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    )
                  } else {
                    const value = row[column.id as keyof ClassData]
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
  )
}
