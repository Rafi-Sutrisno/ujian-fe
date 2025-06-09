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
  Toolbar,
  Typography,
  TableSortLabel
} from '@mui/material'
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
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Class Name', minWidth: 180 },
  { id: 'year', label: 'Class Year', minWidth: 100 },
  { id: 'class', label: 'Class', minWidth: 100 },
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

function EnhancedTableToolbar() {
  return (
    <Toolbar sx={{ pl: 2, pr: 1, bgcolor: 'inherit' }}>
      <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle'>
        Classes Table
      </Typography>
    </Toolbar>
  )
}

export default function ClassTableStudent() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [rows, setRows] = React.useState<Data[]>([])

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth(`/api/class/user`, undefined, 'GET')
      console.log(data)

      if (data.status) {
        const transformed = data.data.map(
          (result: any): Data => ({
            id: result.id,
            name: result.name,
            year: result.year,
            class: result.class,
            short_name: result.short_name
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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const sortedRows = rows.slice().sort(getComparator(order, orderBy))

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <EnhancedTableToolbar />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
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
                return (
                  <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.class}</TableCell>

                    <TableCell align='center'>
                      <Stack direction='row' spacing={1} justifyContent='center'>
                        <Link href={`/user/class/${row.id}`} passHref>
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
    </>
  )
}
