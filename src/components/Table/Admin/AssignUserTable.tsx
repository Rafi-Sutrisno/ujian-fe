'use client'

import * as React from 'react'

import { useImperativeHandle, forwardRef } from 'react'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox
} from '@mui/material'

import { fetchWithAuth } from '@/utils/api'

export interface AssignUserTableRef {
  handleCreateMany: () => void
}

interface AssignUserTableProps {
  id: string
  onSuccess?: () => void
  onError?: (message?: string) => void
}

interface Column {
  id: 'id' | 'name' | 'email' | 'role' | 'noid'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 180 },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'noid', label: 'NOID', minWidth: 130 }
]

interface Data {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  noid: string
}

const AssignUserClassTable = forwardRef<AssignUserTableRef, AssignUserTableProps>(({ id, onSuccess, onError }, ref) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  const [rows, setRows] = React.useState<Data[]>([])

  const handleCreateMany = async () => {
    const selectedRows = rows.filter(row => selectedIds.has(row.id))

    if (selectedRows.length === 0) {
      console.warn('No users selected.')

      return
    }

    const payload = selectedRows.map(row => ({
      user_id: row.id,
      class_id: id // from props
    }))

    try {
      const data = await fetchWithAuth(`/api/user_class/create_many`, payload, 'POST')

      if (data.status === false) {
        console.error('Failed to assign users:', data)
        onError?.(data?.message || 'Failed to assign users.')
      } else {
        // console.log('Users assigned successfully:', data)
        onSuccess?.()

        // fetchData()
      }
    } catch (error) {
      console.error('Error assigning users:', error)
      onError?.('Network error occurred.')
    }
  }

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth(`/api/user_class/class/unassigned/${id}`, undefined, 'GET')

      // console.log('unasigned:', data)

      if (data.status) {
        const transformed = data.data.map(
          (result: any): Data => ({
            id: result.id,
            name: result.name, // nested access
            email: result.email, // nested access
            role: result.role_id === 1 ? 'admin' : 'user',
            noid: result.noid
          })
        )

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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleToggleRow = (id: string) => {
    setSelectedIds(prev => {
      const updated = new Set(prev)

      if (updated.has(id)) {
        updated.delete(id)
      } else {
        updated.add(id)
      }

      return updated
    })
  }

  const isSelected = (id: string) => selectedIds.has(id)

  useImperativeHandle(ref, () => ({
    handleCreateMany
  }))

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='user table'>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox' />
              {columns.map(column => (
                <TableCell key={column.id} align={column.align ?? 'left'} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow hover role='checkbox' key={row.id} selected={isSelected(row.id)}>
                <TableCell padding='checkbox'>
                  <Checkbox color='primary' checked={isSelected(row.id)} onChange={() => handleToggleRow(row.id)} />
                </TableCell>
                {columns.map(column => (
                  <TableCell key={column.id} align={column.align ?? 'left'}>
                    {row[column.id]}
                  </TableCell>
                ))}
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
})

export default AssignUserClassTable
