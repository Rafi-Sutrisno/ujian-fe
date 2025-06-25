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
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import Box from '@mui/material/Box'
import { Card, CardContent, CardHeader, DialogContent, Typography } from '@mui/material'

import { fetchWithAuth } from '@/utils/api'

interface ExamTableProps {
  exam_id: string
}

interface Column {
  id: keyof Data | 'action' | 'score'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
  sortable?: boolean
}

interface Data {
  id: string
  name: string
  noid: string
  total_correct: number
  total_problem: number
  status: string
  finished_at: string
  accepted_problems: string
  wrong_problems: string
  no_submission_problems: string
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170, sortable: true },
  { id: 'noid', label: 'No Id', minWidth: 170, sortable: true },
  { id: 'total_correct', label: 'Total Correct', minWidth: 100, sortable: true },
  { id: 'score', label: 'Score', minWidth: 170, sortable: true },
  { id: 'status', label: 'Status', minWidth: 170, sortable: true },
  { id: 'finished_at', label: 'Finished At', minWidth: 170, sortable: true },
  { id: 'action', label: 'Action', minWidth: 100, sortable: true }
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

const ResultTableAdmin: React.FC<ExamTableProps> = ({ exam_id }) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<Order>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('total_correct')
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedResult, setSelectedResult] = React.useState<{
    userName: string
    accepted: string[]
    wrong: string[]
    noSubmission: string[]
  } | null>(null)

  const [rows, setRows] = React.useState<Data[]>([])

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth(`/api/submission/stats/exam/${exam_id}`, undefined, 'GET')

      // console.log('ini dari be: ', data)

      if (data.status) {
        const transformed = data.data.map(
          (result: any): Data => ({
            id: result.user_id,
            name: result.user_name,
            noid: result.user_no_id,
            total_correct: result.total_correct,
            total_problem: result.total_problem,
            status: result.status === 0 ? 'not finished' : 'finished',
            finished_at: result.status === 1 ? result.finished_at : '-',
            accepted_problems: result.accepted_problems,
            no_submission_problems: result.no_submission_problems,
            wrong_problems: result.wrong_problems
          })
        )

        // console.log('update: ', transformed)
        setRows(transformed)

        // // console.log('transformed:', transformed)
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

  const handleSeeResult = (row: any) => {
    setSelectedResult({
      userName: row.name,
      accepted: row.accepted_problems?.split(',') || [],
      wrong: row.wrong_problems?.split(',') || [],
      noSubmission: row.no_submission_problems?.split(',') || []
    })
    setOpenDialog(true)
  }

  return (
    <Card sx={{ mt: 4 }}>
      <CardHeader title='Result' />
      <CardContent>
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
                        if (column.id === 'total_correct') {
                          const correct = row.total_correct
                          const total = row.total_problem

                          return (
                            <TableCell key={column.id} align={column.align ?? 'left'}>
                              {correct} / {total}
                            </TableCell>
                          )
                        }

                        if (column.id === 'score') {
                          const correct = row.total_correct
                          const total = row.total_problem
                          const percentage = total > 0 ? ((correct / total) * 100).toFixed(2) : '0.00'

                          return (
                            <TableCell key={column.id} align={column.align ?? 'left'}>
                              {percentage}%
                            </TableCell>
                          )
                        }

                        if (column.id === 'action') {
                          return (
                            <TableCell key={column.id} align={column.align ?? 'left'}>
                              <Button
                                variant='outlined'
                                size='small'
                                color='primary'
                                onClick={() => handleSeeResult(row)}
                              >
                                View
                              </Button>
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
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth='sm' fullWidth>
            <DialogTitle>Result for {selectedResult?.userName}</DialogTitle>
            <DialogContent dividers>
              <Typography variant='subtitle1'>✅ Accepted Problems</Typography>
              <ul>{selectedResult?.accepted.map((title, idx) => <li key={`acc-${idx}`}>{title}</li>)}</ul>
            </DialogContent>
          </Dialog>
        </Paper>
      </CardContent>{' '}
    </Card>
  )
}

export default ResultTableAdmin
