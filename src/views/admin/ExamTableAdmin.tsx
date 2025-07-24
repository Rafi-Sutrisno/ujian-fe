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
import DialogActions from '@mui/material/DialogActions'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import Box from '@mui/material/Box'
import {
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  Typography,
  Switch,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  CardHeader
} from '@mui/material'
import TextField from '@mui/material/TextField'

import { v4 as uuidv4 } from 'uuid'

import { fetchWithAuth } from '@/utils/api'

import TopSectionCreateExam from '@/components/top-section/topSectionCreateExam'

const frontnedURL = process.env.NEXT_PUBLIC_APP_URL

interface ExamTableProps {
  class_id: string | null
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

interface LangData {
  id: string
  name: string
  code: string
}

type FormData = {
  name: string
  short_name: string
  is_published: boolean
  start_time: string
  duration: string
  end_time: string
  is_seb_restricted: boolean
  seb_browser_key: string
  seb_config_key: string
  seb_quit_url: string
  allowed_languages: string[]
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
  const [order, setOrder] = React.useState<Order>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('created_at')
  const [openDialog, setOpenDialog] = React.useState(false)

  const [rows, setRows] = React.useState<Data[]>([])
  const [lang, setLang] = React.useState<LangData[]>([])

  const [sebKeyEnabled, setSebKeyEnabled] = React.useState(false)
  const [sebConfigKeyEnabled, setSebConfigKeyEnabled] = React.useState(false)
  const [sebQuitUrlEnabled, setSebQuitUrlEnabled] = React.useState(false)

  const fetchData = async () => {
    try {
      const data = class_id
        ? await fetchWithAuth(`/api/exam/byclass/${class_id}`, undefined, 'GET')
        : await fetchWithAuth(`/api/exam/byuser`, undefined, 'GET')

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

        setRows(transformed)

        const langData = await fetchWithAuth(`/api/language/all`, undefined, 'GET')

        if (langData.status) {
          const transformed = langData.data.map(
            (result: any): LangData => ({
              id: result.id,
              name: result.name,
              code: result.code
            })
          )

          // console.log('lang: ', transformed)
          setLang(transformed)
        }
      } else {
        console.error('Failed to fetch exam:', data.message)
      }
    } catch (error) {
      console.error('Error fetching exam:', error)
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
    // console.log('Delete ID:', selectedId)
    setOpenDialog(false)
  }

  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    short_name: '',
    is_published: true,
    start_time: '',
    duration: '',
    end_time: '',
    is_seb_restricted: false,
    seb_browser_key: '',
    seb_config_key: '',
    seb_quit_url: '',
    allowed_languages: []
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

    // console.log('data:', formattedData)

    const {
      name,
      short_name,
      is_published,
      start_time,
      duration,
      is_seb_restricted,
      seb_browser_key,
      seb_config_key,
      seb_quit_url,
      allowed_languages
    } = formattedData

    // // console.log('data: ', name, short_name, is_published, start_time, duration)
    // console.log('allowd lang:', allowed_languages.length)

    if (
      !name ||
      !short_name ||
      is_published === null ||
      is_published === undefined ||
      !start_time ||
      !duration ||
      allowed_languages.length <= 0
    ) {
      // console.log('all field required')

      return setSnackbar({
        open: true,
        message: 'All fields cant be null.',
        severity: 'error'
      })
    }

    try {
      const payload = {
        class_id,
        name,
        short_name,
        is_published,
        start_time,
        duration,
        is_seb_restricted,
        seb_browser_key: sebKeyEnabled ? seb_browser_key : '',
        seb_config_key: sebConfigKeyEnabled ? seb_config_key : '',
        seb_quit_url: sebQuitUrlEnabled ? seb_quit_url : ''
      }

      // console.log('ini payload: ', payload)

      const data = await fetchWithAuth(`/api/exam/`, payload, 'POST')

      if (data.status === false) {
        // console.log(data)

        return setSnackbar({
          open: true,
          message: data?.message || 'Failed to create exam.',
          severity: 'error'
        })
      }

      // console.log('Exam created:', data)

      const payload2 = allowed_languages.map(id => ({
        lang_id: parseInt(id),
        exam_id: data.data.id
      }))

      // console.log('ini payload2:', payload2)
      const data2 = await fetchWithAuth(`/api/exam_lang/create_many`, payload2, 'POST')

      if (data2.status === false) {
        // console.log(data2)

        return setSnackbar({
          open: true,
          message: data2?.message || 'Failed to create exam.',
          severity: 'error'
        })
      }

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

  const onError = (message?: string) => {
    setSnackbar({
      open: true,
      message: message || 'Failed to remove user from class.',
      severity: 'error'
    })
  }

  const onSucess = (message?: string) => {
    setSnackbar({
      open: true,
      message: message || 'Success to create exam using yaml.',
      severity: 'success'
    })
    fetchData()
  }

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        {class_id ? (
          <TopSectionCreateExam
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

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.is_seb_restricted}
                            onChange={e => setFormData(prev => ({ ...prev, is_seb_restricted: e.target.checked }))}
                            name='is_seb_restricted'
                            color='primary'
                          />
                        }
                        label='Require Safe Exam Browser (SEB) Only'
                      />
                    </Grid>

                    {formData.is_seb_restricted && (
                      <>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox checked={sebKeyEnabled} onChange={e => setSebKeyEnabled(e.target.checked)} />
                            }
                            label={
                              <Typography color={sebKeyEnabled ? 'textPrimary' : 'textSecondary'}>
                                Enable SEB Browser Key
                              </Typography>
                            }
                          />
                          <TextField
                            fullWidth
                            label='SEB Browser Key'
                            name='seb_browser_key'
                            value={formData.seb_browser_key}
                            onChange={e => setFormData(prev => ({ ...prev, seb_browser_key: e.target.value }))}
                            disabled={!sebKeyEnabled}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={sebConfigKeyEnabled}
                                onChange={e => setSebConfigKeyEnabled(e.target.checked)}
                              />
                            }
                            label={
                              <Typography color={sebConfigKeyEnabled ? 'textPrimary' : 'textSecondary'}>
                                Enable SEB Config Key
                              </Typography>
                            }
                          />

                          <TextField
                            fullWidth
                            label='SEB Config Key'
                            name='seb_config_key'
                            value={formData.seb_config_key}
                            onChange={e => setFormData(prev => ({ ...prev, seb_config_key: e.target.value }))}
                            disabled={!sebConfigKeyEnabled}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant='body2' color='textSecondary'>
                            If both left empty, access will only be checked by User-Agent
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={sebQuitUrlEnabled}
                                onChange={e => {
                                  const checked = e.target.checked

                                  setSebQuitUrlEnabled(checked)

                                  if (checked) {
                                    const randomId = uuidv4().slice(0, 8)
                                    const quitUrl = `${frontnedURL}/${randomId}`

                                    setFormData(prev => ({ ...prev, seb_quit_url: quitUrl }))
                                  } else {
                                    setFormData(prev => ({ ...prev, seb_quit_url: '' }))
                                  }
                                }}
                              />
                            }
                            label={
                              <Typography color={sebQuitUrlEnabled ? 'textPrimary' : 'textSecondary'}>
                                Enable SEB Quit Url
                              </Typography>
                            }
                          />

                          <TextField
                            fullWidth
                            label='SEB Quit Url'
                            name='seb_quit_url'
                            value={formData.seb_quit_url}
                            InputProps={{
                              readOnly: sebQuitUrlEnabled
                            }}
                            disabled={!sebQuitUrlEnabled && formData.seb_quit_url === ''}
                            helperText={
                              sebQuitUrlEnabled ? 'URL ini akan digunakan untuk mengakhiri SEB setelah ujian.' : ''
                            }
                          />
                        </Grid>
                      </>
                    )}

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id='language-select-label'>Allowed Programming Languages</InputLabel>
                        <Select
                          labelId='language-select-label'
                          id='language-select'
                          multiple
                          value={formData.allowed_languages} // <-- array of IDs
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              allowed_languages:
                                typeof e.target.value === 'string'
                                  ? e.target.value.split(',') // defensive for string input
                                  : e.target.value
                            }))
                          }
                          label='Allowed Programming Languages'
                          renderValue={selected =>
                            (selected as string[])
                              .map(id => lang.find(l => String(l.id) === String(id))?.name || id)
                              .join(', ')
                          }
                        >
                          {lang.map(l => (
                            <MenuItem key={l.id} value={String(l.id)}>
                              <Checkbox checked={formData.allowed_languages.includes(String(l.id))} />
                              <ListItemText primary={l.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            }
            class_id={class_id}
            onSave={handleSubmit}
            onSave2={onSucess}
            onError={onError}
          />
        ) : (
          <CardHeader title='Exam List' />
        )}

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
