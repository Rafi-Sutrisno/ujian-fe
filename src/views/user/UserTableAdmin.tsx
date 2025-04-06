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
  id: 'id' | 'name' | 'email' | 'role' | 'noid' | 'created_at'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 180 },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'noid', label: 'NOID', minWidth: 130 },
  { id: 'created_at', label: 'Created At', minWidth: 170 }
]

interface Data {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  noid: string
  created_at: string
}

function createData(
  id: string,
  name: string,
  email: string,
  role: 'admin' | 'user',
  noid: string,
  created_at: string
): Data {
  return { id, name, email, role, noid, created_at }
}

// Sample users (2 admin, the rest user)
const rows: Data[] = [
  createData('1', 'Alice Admin', 'alice@example.com', 'admin', '5025211001', '2025-04-01 10:00:00'),
  createData('2', 'Bob Admin', 'bob@example.com', 'admin', '5025211002', '2025-04-01 10:10:00'),
  createData('3', 'Charlie User', 'charlie@example.com', 'user', '5025211003', '2025-04-02 09:00:00'),
  createData('4', 'David User', 'david@example.com', 'user', '5025211004', '2025-04-02 10:15:00'),
  createData('5', 'Eve User', 'eve@example.com', 'user', '5025211005', '2025-04-02 11:30:00'),
  createData('6', 'Frank User', 'frank@example.com', 'user', '5025211006', '2025-04-02 13:00:00'),
  createData('7', 'Grace User', 'grace@example.com', 'user', '5025211007', '2025-04-03 08:45:00'),
  createData('8', 'Hank User', 'hank@example.com', 'user', '5025211008', '2025-04-03 09:30:00'),
  createData('9', 'Ivy User', 'ivy@example.com', 'user', '5025211009', '2025-04-03 10:20:00'),
  createData('10', 'Jack User', 'jack@example.com', 'user', '5025211010', '2025-04-03 11:00:00'),
  createData('11', 'Karen User', 'karen@example.com', 'user', '5025211011', '2025-04-03 12:30:00'),
  createData('12', 'Leo User', 'leo@example.com', 'user', '5025211012', '2025-04-04 09:00:00'),
  createData('13', 'Mona User', 'mona@example.com', 'user', '5025211013', '2025-04-04 10:15:00'),
  createData('14', 'Nina User', 'nina@example.com', 'user', '5025211014', '2025-04-04 11:45:00'),
  createData('15', 'Oscar User', 'oscar@example.com', 'user', '5025211015', '2025-04-04 13:20:00'),
  createData('16', 'Pam User', 'pam@example.com', 'user', '5025211016', '2025-04-05 08:10:00'),
  createData('17', 'Quinn User', 'quinn@example.com', 'user', '5025211017', '2025-04-05 09:25:00'),
  createData('18', 'Rose User', 'rose@example.com', 'user', '5025211018', '2025-04-05 10:40:00'),
  createData('19', 'Sam User', 'sam@example.com', 'user', '5025211019', '2025-04-05 11:55:00'),
  createData('20', 'Tina User', 'tina@example.com', 'user', '5025211020', '2025-04-05 13:10:00')
]

export default function UserTableAdmin() {
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
        <Table stickyHeader aria-label='user table'>
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
                      {value}
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
