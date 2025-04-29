'use client'

import { useState } from 'react'

// MUI Imports
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent
} from '@mui/material'
import { fetchWithAuth } from '@/utils/api'

interface AddUserModalProps {
  open?: boolean
  onClose?: () => void
  onAdded?: () => void
}

const AddClassModal = ({ open = false, onClose, onAdded }: AddUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    className: '',
    short_name: ''
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name as string]: value
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { name, year, className, short_name } = formData

    if (!name || !year || !className || !short_name) {
      return setSnackbar({
        open: true,
        message: 'All fields are required.',
        severity: 'error'
      })
    }

    const payload = {
      name,
      year,
      class: className,
      short_name
    }

    try {
      const data = await fetchWithAuth('/api/class/create', payload, 'POST')

      if (data.status) {
        setSnackbar({
          open: true,
          message: 'User added successfully!',
          severity: 'success'
        })
        setFormData({ name: '', year: '', className: '', short_name: '' })
        onClose?.()
        onAdded?.()
      } else {
        setSnackbar({
          open: true,
          message: data?.message || 'Failed to add user.',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while adding user.',
        severity: 'error'
      })
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
        <DialogTitle>Add New Class</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Name'
                  placeholder='Example: Dasar Pemrograman'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
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
                    value={formData.className}
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
                  placeholder='Example: IF-DPA'
                  name='short_name'
                  value={formData.short_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent='end' gap={2}>
            <Grid item>
              <Button onClick={onClose} variant='outlined' color='inherit'>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button type='submit' variant='contained' color='primary' onClick={handleSubmit}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

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

export default AddClassModal
