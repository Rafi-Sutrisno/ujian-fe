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

interface Column {
  id: keyof ExamData
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'class', label: 'Class', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'short_name', label: 'Short Name', minWidth: 120 },
  { id: 'is_published', label: 'Published', minWidth: 100 },
  { id: 'start_time', label: 'Start Time', minWidth: 170 },
  { id: 'duration', label: 'Duration', minWidth: 120 },
  { id: 'end_time', label: 'End Time', minWidth: 170 },
  { id: 'created_at', label: 'Created At', minWidth: 170 }
]

interface ExamData {
  id: string
  class: string
  name: string
  short_name: string
  is_published: boolean
  start_time: string
  duration: string
  end_time: string
  created_at: string
}

function createData(
  id: string,
  className: string,
  name: string,
  short_name: string,
  is_published: boolean,
  start_time: string,
  duration: string,
  end_time: string,
  created_at: string
): ExamData {
  return { id, class: className, name, short_name, is_published, start_time, duration, end_time, created_at }
}

const rows: ExamData[] = [
  createData(
    '1',
    'A1',
    'Math Final',
    'Math-F',
    true,
    '2025-04-10 09:00',
    '01:30:00',
    '2025-04-10 10:30',
    '2025-04-01 12:00'
  ),
  createData(
    '2',
    'B2',
    'Science Midterm',
    'Sci-M',
    false,
    '2025-04-12 13:00',
    '01:15:00',
    '2025-04-12 14:15',
    '2025-04-02 08:45'
  ),
  createData(
    '3',
    'C3',
    'History Quiz',
    'Hist-Q',
    true,
    '2025-04-15 10:00',
    '00:45:00',
    '2025-04-15 10:45',
    '2025-04-03 09:30'
  ),
  createData(
    '4',
    'D4',
    'English Test',
    'Eng-T',
    false,
    '2025-04-18 11:30',
    '01:00:00',
    '2025-04-18 12:30',
    '2025-04-04 11:00'
  )
  // add more data as needed
]

export default function ExamTableAdmin() {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='exam table'>
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                {columns.map(column => {
                  const value = row[column.id]
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
  )
}
