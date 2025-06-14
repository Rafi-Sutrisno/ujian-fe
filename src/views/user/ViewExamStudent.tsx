'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import CardContent from '@mui/material/CardContent'
import { Button, Box, Typography, Snackbar, Alert, FormControl, InputLabel } from '@mui/material'

import { fetchWithAuth, fetchWithAuthCookie, fetchWithCookie } from '@/utils/api'

declare global {
  interface Window {
    SafeExamBrowser?: any
  }
}

interface ViewExamProps {
  id: string
}

interface LangData {
  id: string
  name: string
  code: string
}

type FormData = {
  id: string
  name: string
  short_name: string
  is_published: boolean
  start_time: string
  duration: string
  end_time: string
  is_seb_restricted: boolean
  // seb_browser_key: string
  // seb_config_key: string
  allowed_languages: LangData[] // 👈 Correct type
}

const ViewExamStudent: React.FC<ViewExamProps> = ({ id }) => {
  const router = useRouter()
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })
  const [lang, setLang] = useState<LangData[]>([])

  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    short_name: '',
    is_published: true,
    start_time: '',
    duration: '',
    end_time: '',
    is_seb_restricted: false,
    allowed_languages: []
  })

  const fetchData = async () => {
    try {
      // console.log(id)

      const data = await fetchWithAuth(`/api/exam/${id}`, undefined, 'GET')

      // console.log('ini data: ', data)

      if (data.status && data.data) {
        const result = data.data

        setFormData({
          id: result.id,
          name: result.name,
          short_name: result.short_name,
          is_published: result.is_published,
          start_time: result.start_time,
          duration: result.duration,
          end_time: result.end_time,
          is_seb_restricted: result.is_seb_restricted,
          allowed_languages: result.allowed_languages
        })
      } else {
        console.error('Failed to fetch exam:', data.message)
      }
    } catch (err) {
      console.error('Error fetching exam:', err)
    }
  }

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const startExamSession = async () => {
    try {
      let configKey = ''
      let browserExamKey = ''

      if (typeof window.SafeExamBrowser !== 'undefined' && window.SafeExamBrowser.security) {
        await window.SafeExamBrowser.security.updateKeys(() => {
          configKey = window.SafeExamBrowser.security.configKey
          browserExamKey = window.SafeExamBrowser.security.browserExamKey
        })
      }

      const payload = {
        exam_id: id,
        config_key: configKey,
        browser_exam_key: browserExamKey,
        seb_url: window.location.href
      }

      const startExam = await fetchWithAuth('/api/exam_session/start_exam', payload, 'POST')

      // console.log('ini start exam: ', startExam)

      if (startExam.status) {
        setSnackbar({
          open: true,
          message: 'Success Start Exam, redirecting to playground page.',
          severity: 'success'
        })
        router.push(`/user/playground/${startExam.data.exam_id}`)
      } else {
        setSnackbar({
          open: true,
          message: startExam.error || 'Failed to start exam.',
          severity: 'error'
        })
        console.error('Failed to start exam:', startExam.message)
      }
    } catch (err) {
      console.error('Error start exam:', err)
      setSnackbar({
        open: true,
        message: 'Error start exam: ' + err,
        severity: 'error'
      })
    }
  }

  return (
    <Card>
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
          <Typography variant='h5' fontWeight='bold'>
            View Exam
          </Typography>

          <Button variant='contained' color='primary' onClick={startExamSession}>
            Start Exam
          </Button>
        </Box>
        <form>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Name'
                name='name'
                value={formData.name}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Short Name'
                name='short_name'
                value={formData.short_name}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <TextField
                fullWidth
                label='Published'
                name='is_published'
                value={formData.is_published ? 'Yes' : 'No'}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid> */}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Start Time'
                name='start_time'
                value={formData.start_time}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Duration'
                name='duration'
                value={formData.duration}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='End Time'
                name='end_time'
                value={formData.end_time}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Is Seb Restricted'
                name='is_seb_restricted'
                value={formData.is_seb_restricted ? 'Yes' : 'No'}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Allowed Programming Languages'
                name='allowed_languages'
                value={formData.allowed_languages.map(lang => lang.name).join(', ')}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
          </Grid>
        </form>
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

export default ViewExamStudent
