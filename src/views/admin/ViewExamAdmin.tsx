'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import type { SelectChangeEvent } from '@mui/material'
import {
  Alert,
  MenuItem,
  Snackbar,
  FormControlLabel,
  Checkbox,
  Switch,
  Select,
  ListItemText,
  FormControl,
  InputLabel,
  Box
} from '@mui/material'
import TopSection2Modal from '@/components/top-section/topsection2modal'

import { v4 as uuidv4 } from 'uuid'

import { fetchWithAuth } from '@/utils/api'

interface ViewExamProps {
  id: string
}

type Language = {
  id: number
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
  allowed_languages: Language[]
}

const frontnedURL = process.env.NEXT_PUBLIC_APP_URL

const ViewExamAdmin: React.FC<ViewExamProps> = ({ id }) => {
  const router = useRouter()
  const [lang, setLang] = useState<Language[]>([])

  const [formData, setFormData] = useState<FormData>({
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

  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [sebKeyEnabled, setSebKeyEnabled] = useState(false)
  const [sebConfigKeyEnabled, setSebConfigKeyEnabled] = useState(false)
  const [sebQuitUrlEnabled, setSebQuitUrlEnabled] = useState(false)

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      duration: `${hours}h${minutes}m${seconds}s`
    }))
  }, [hours, minutes, seconds])

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const fetchData = async () => {
    try {
      // console.log(id)
      const json = await fetchWithAuth(`/api/exam/${id}`, undefined, 'GET')

      // console.log(json)

      if (json.status && json.data) {
        const result = json.data
        const durationRegex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/
        const match = result.duration.match(durationRegex)

        const parsedHours = match && match[1] ? parseInt(match[1]) : 0
        const parsedMinutes = match && match[2] ? parseInt(match[2]) : 0
        const parsedSeconds = match && match[3] ? parseInt(match[3]) : 0

        setHours(parsedHours)
        setMinutes(parsedMinutes)
        setSeconds(parsedSeconds)
        setFormData({
          name: result.name,
          short_name: result.short_name,
          is_published: result.is_published,
          start_time: result.start_time,
          duration: result.duration,
          end_time: result.end_time,
          is_seb_restricted: result.is_seb_restricted,
          seb_browser_key: result.seb_browser_key,
          seb_config_key: result.seb_config_key,
          seb_quit_url: result.seb_quit_url,
          allowed_languages: result.allowed_languages
        })

        if (result.seb_browser_key !== '') {
          setSebKeyEnabled(true)
        }

        if (result.seb_config_key !== '') {
          setSebConfigKeyEnabled(true)
        }

        if (result.seb_quit_url !== '') {
          setSebQuitUrlEnabled(true)
        }

        const langData = await fetchWithAuth(`/api/language/all`, undefined, 'GET')

        if (langData.status) {
          const transformed = langData.data.map(
            (result: any): Language => ({
              id: result.id,
              name: result.name,
              code: result.code
            })
          )

          // console.log('lang: ', transformed)
          setLang(transformed)
        }
      } else {
        console.error('Failed to fetch exam:', json.message)
      }
    } catch (err) {
      console.error('Error fetching exam:', err)
    }
  }

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLanguageChange = (event: SelectChangeEvent<string[]>) => {
    const selectedIds = event.target.value // string[]

    // Update formData.allowed_languages with the full objects based on selectedIds
    const updatedLanguages = lang.filter(l => selectedIds.includes(String(l.id)))

    setFormData(prev => ({
      ...prev,
      allowed_languages: updatedLanguages
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

    // console.log('data: ', name, short_name, is_published, start_time, duration)

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

      // console.log('ini payload:', payload)

      const data = await fetchWithAuth(`/api/exam/${id}`, payload, 'PATCH')

      if (data.status === false) {
        // console.log(data)

        return setSnackbar({
          open: true,
          message: data?.message || 'Failed to update exam.',
          severity: 'error'
        })
      }

      // console.log('Exam updated:', data)

      const payload2 = allowed_languages.map(lang => ({
        lang_id: lang.id,
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
        message: 'Exam updated successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while updating exam.',
        severity: 'error'
      })
    }
  }

  const handleDelete = async () => {
    // console.log('Exam Deleted:', formData.name)

    try {
      const result = await fetchWithAuth(`/api/exam/${id}`, undefined, 'DELETE')

      if (result.status === false) {
        // console.log(result)

        return setSnackbar({
          open: true,
          message: result?.message || 'Failed to delete exam.',
          severity: 'error'
        })
      }

      // console.log('Exam deleted:', result)

      setSnackbar({
        open: true,
        message: 'Exam deleted successfully!',
        severity: 'success'
      })
      setTimeout(() => {
        router.back()
      }, 1000)

      // Redirect or show confirmation
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while updating exam.',
        severity: 'error'
      })
    }
  }

  const DisplayField = ({ label, value }: { label: string; value: string | number }) => (
    <Box mb={6} borderRadius={2}>
      <Typography variant='subtitle1' fontWeight='bold' color='text.primary' gutterBottom>
        {label}
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        {value || '-'}
      </Typography>
    </Box>
  )

  return (
    <>
      <Card>
        <CardContent>
          <TopSection2Modal
            title='View Exam'
            primaryButtonText='Edit'
            primaryModalContent={
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
                            onChange={e => setFormData(prev => ({ ...prev, seb_quit_url: e.target.value }))}
                            disabled={!sebQuitUrlEnabled}
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
                          value={formData.allowed_languages.map(lang => String(lang.id))}
                          onChange={handleLanguageChange}
                          label='Allowed Programming Languages'
                          renderValue={selected =>
                            (selected as string[]).map(id => lang.find(l => String(l.id) === id)?.name || id).join(', ')
                          }
                        >
                          {lang.map(l => (
                            <MenuItem key={l.id} value={String(l.id)}>
                              <Checkbox
                                checked={formData.allowed_languages.some(al => String(al.id) === String(l.id))}
                              />
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
            onPrimarySave={handleSubmit}
            secondaryButtonText='Delete'
            secondaryModalContent={
              <Typography>
                Are you sure you want to delete exam <strong>{formData?.name}</strong>?
              </Typography>
            }
            onSecondarySave={handleDelete}
          />

          <Grid container>
            <Grid item xs={12}>
              <DisplayField label='Name' value={formData.name} />
            </Grid>

            <Grid item xs={12}>
              <DisplayField label='Short Name' value={formData.short_name} />
            </Grid>

            <Grid item xs={12}>
              <DisplayField label='Published' value={formData.is_published ? 'Yes' : 'No'} />
            </Grid>

            <Grid item xs={12}>
              <DisplayField label='Start Time' value={formData.start_time} />
            </Grid>

            <Grid item xs={12}>
              <DisplayField label='Duration' value={formData.duration} />
            </Grid>

            <Grid item xs={12}>
              <DisplayField label='End Time' value={formData.end_time} />
            </Grid>

            <Grid item xs={12}>
              <DisplayField
                label='Require Safe Exam Browser (SEB) Only'
                value={formData.is_seb_restricted ? 'Yes' : 'No'}
              />
            </Grid>

            {formData.is_seb_restricted && (
              <>
                <Grid item xs={12}>
                  <DisplayField label='SEB Browser Key' value={formData.seb_browser_key} />
                </Grid>

                <Grid item xs={12}>
                  <DisplayField label='SEB Config Key' value={formData.seb_config_key} />
                </Grid>

                <Grid item xs={12}>
                  <DisplayField label='SEB Quit Url' value={formData.seb_quit_url} />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <DisplayField
                label='Allowed Programming Languages'
                value={formData.allowed_languages.map(l => l.name).join(', ')}
              />
            </Grid>
          </Grid>
        </CardContent>
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

export default ViewExamAdmin
