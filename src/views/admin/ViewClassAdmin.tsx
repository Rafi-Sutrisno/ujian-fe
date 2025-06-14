'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import TopSection2Modal from '@/components/top-section/topsection2modal'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import { Snackbar, Alert, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material'
import { fetchWithAuth } from '@/utils/api'

interface ViewClassProps {
  id: string
}

const ViewClassAdmin: React.FC<ViewClassProps> = ({ id }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    class_name: '',
    short_name: ''
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const fetchData = async () => {
    try {
      // console.log(id)

      const data = await fetchWithAuth(`/api/class/${id}`, undefined, 'GET')

      // console.log('data class ke fetch', data)

      if (data.status && data.data) {
        const result = data.data
        setFormData({
          name: result.name,
          year: result.year,
          class_name: result.class,
          short_name: result.short_name
        })
      } else {
        console.error('Failed to fetch class:', data.message)
      }
    } catch (err) {
      console.error('Error fetching class:', err)
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

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as keyof typeof formData
    const value = e.target.value

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    const { name, year, class_name, short_name } = formData

    if (!name || !year || !class_name || !short_name) {
      return setSnackbar({
        open: true,
        message: 'All fields cant be null.',
        severity: 'error'
      })
    }

    try {
      const result = await fetchWithAuth(`/api/class/${id}`, { name, year, class: class_name, short_name }, 'PATCH')

      if (result.status === false) {
        // console.log(result)
        return setSnackbar({
          open: true,
          message: result?.message || 'Failed to update class.',
          severity: 'error'
        })
      }

      // console.log('Class updated:', result)

      setSnackbar({
        open: true,
        message: 'Class updated successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while updating class.',
        severity: 'error'
      })
    }
  }

  const handleDelete = async () => {
    try {
      const data = await fetchWithAuth(`/api/class/${id}`, undefined, 'DELETE')

      if (data.status === false) {
        // console.log(data)
        return setSnackbar({
          open: true,
          message: data?.message || 'Failed to delete class.',
          severity: 'error'
        })
      }

      // console.log('Class deleted:', data)

      setSnackbar({
        open: true,
        message: 'Class deleted successfully!',
        severity: 'success'
      })
      setTimeout(() => {
        router.push('/admin/class')
      }, 1000)
      // Redirect or show confirmation
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while updating class.',
        severity: 'error'
      })
    }
  }

  return (
    <>
      <Card>
        <CardContent>
          <TopSection2Modal
            title='View Class'
            primaryButtonText='Edit'
            primaryModalContent={
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Name'
                      placeholder='Example: Mathematics'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id='year-label'>Year</InputLabel>
                      <Select
                        labelId='year-label'
                        id='year'
                        name='year'
                        value={formData.year}
                        label='Year'
                        onChange={handleSelectChange}
                      >
                        {Array.from({ length: 2030 - 2020 + 1 }, (_, i) => 2020 + i).map(year => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id='class-label'>Class</InputLabel>
                      <Select
                        labelId='class-label'
                        id='className'
                        name='className'
                        value={formData.class_name}
                        label='Class'
                        onChange={handleSelectChange}
                      >
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(cls => (
                          <MenuItem key={cls} value={cls}>
                            {cls}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Short Name'
                      placeholder='Example: DPA'
                      name='short_name'
                      value={formData.short_name}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            }
            onPrimarySave={handleSubmit}
            secondaryButtonText='Delete'
            secondaryModalContent={
              <Typography>
                Are you sure you want to delete class <strong>{formData?.name}</strong>?
              </Typography>
            }
            onSecondarySave={handleDelete}
          />
          <form>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Name'
                  placeholder='Example: Mathematics'
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
                  label='Year'
                  placeholder='Example: 2025'
                  name='year'
                  value={formData.year}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Class'
                  placeholder='Example: A'
                  name='class_name'
                  value={formData.class_name}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Short Name'
                  placeholder='Example: DPA'
                  name='short_name'
                  value={formData.short_name}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
            </Grid>
          </form>
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

export default ViewClassAdmin
