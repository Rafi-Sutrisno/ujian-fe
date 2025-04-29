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
  onUserAdded?: () => void
}

const AddUserModal = ({ open = false, onClose, onUserAdded }: AddUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    noid: '',
    password: ''
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

    const { name, email, role, noid, password } = formData

    if (!name || !email || !role || !noid || !password) {
      return setSnackbar({
        open: true,
        message: 'All fields are required.',
        severity: 'error'
      })
    }

    const roleMapping: Record<string, number> = {
      user: 1,
      admin: 2
    }

    const roleId = roleMapping[role.toLowerCase()]
    if (!roleId) {
      return setSnackbar({
        open: true,
        message: 'Role must be "user" or "admin".',
        severity: 'error'
      })
    }

    const payload = {
      name,
      email,
      noid,
      password,
      role_id: roleId
    }

    try {
      const data = await fetchWithAuth('/api/user/add', payload, 'POST')

      if (data.status) {
        setSnackbar({
          open: true,
          message: 'User added successfully!',
          severity: 'success'
        })
        setFormData({ name: '', email: '', role: '', noid: '', password: '' })
        onClose?.()
        onUserAdded?.()
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
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Name'
                  placeholder='Example: Alice Smith'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Email'
                  placeholder='Example: alice@example.com'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id='role-label'>Role</InputLabel>
                  <Select
                    labelId='role-label'
                    name='role'
                    value={formData.role}
                    label='Role'
                    onChange={handleSelectChange}
                  >
                    <MenuItem value='user'>User</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='NOID'
                  placeholder='Example: 5025211001'
                  name='noid'
                  value={formData.noid}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Password'
                  type='password'
                  name='password'
                  value={formData.password}
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

export default AddUserModal
