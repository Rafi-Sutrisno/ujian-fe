'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { SelectChangeEvent } from '@mui/material/Select'
import TopSection2Modal from '@/components/top-section/topsection2modal'
import { Snackbar, Alert } from '@mui/material'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '@/utils/api'

interface ViewUserProps {
  id: string
}

const ViewUserAdmin: React.FC<ViewUserProps> = ({ id }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    role: '',
    noid: ''
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const fetchUser = async () => {
    try {
      // console.log(id)

      const data = await fetchWithAuth(`/api/user/${id}`, undefined, 'GET')

      // console.log(data)

      if (data.status && data.data) {
        const user = data.data
        setFormData({
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role_id === 1 ? 'admin' : 'user',
          noid: user.noid
        })
      } else {
        console.error('Failed to fetch user:', data.message)
      }
    } catch (err) {
      console.error('Error fetching user:', err)
    }
  }

  useEffect(() => {
    if (id) fetchUser()
  }, [id])

  // handleChange, handleSelectChange, handleSubmit, handleDelete stay the same...
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }))
  }

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    const { username, name, email, noid } = formData

    if (!username || !name || !email || !noid) {
      return setSnackbar({
        open: true,
        message: 'All fields cant be null.',
        severity: 'error'
      })
    }

    try {
      const data = await fetchWithAuth(`/api/user/${id}`, { username, name, email, noid }, 'PATCH')

      if (data.status === false) {
        // console.log(data)
        return setSnackbar({
          open: true,
          message: data?.message || 'Failed to update user.',
          severity: 'error'
        })
      }

      // console.log('User updated:', data)

      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while updating user.',
        severity: 'error'
      })
    }
  }

  const handleDelete = async () => {
    try {
      const data = await fetchWithAuth(`/api/user/${id}`, undefined, 'DELETE')

      if (data.status === false) {
        // console.log(data)
        return setSnackbar({
          open: true,
          message: data?.message || 'Failed to delete user.',
          severity: 'error'
        })
      }

      // console.log('User deleted:', data)

      setSnackbar({
        open: true,
        message: 'User deleted successfully!',
        severity: 'success'
      })
      router.push('/admin/user')
      // Redirect or show confirmation
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while updating user.',
        severity: 'error'
      })
    }
  }

  return (
    <>
      <Card>
        <CardContent>
          <TopSection2Modal
            title='View User'
            primaryButtonText='Edit'
            primaryModalContent={
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Username'
                      placeholder='Example: Alice 1'
                      name='username'
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Name'
                      placeholder='Example: Alice Smith'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
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
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='role-label'>Role</InputLabel>
                      <Select
                        labelId='role-label'
                        id='role'
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
                    />
                  </Grid>
                </Grid>
              </CardContent>
            }
            onPrimarySave={handleSubmit}
            onSecondarySave={handleDelete}
            secondaryButtonText='Delete'
            secondaryModalContent={
              <Typography>
                Are you sure you want to delete user <strong>{formData?.name}</strong>?
              </Typography>
            }
          />

          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Username'
                placeholder='Example: Alice 1'
                name='username'
                value={formData.username}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Name'
                placeholder='Example: Alice Smith'
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
                label='Email'
                placeholder='Example: alice@example.com'
                name='email'
                value={formData.email}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Role'
                name='Role'
                value={formData.role}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='NOID'
                placeholder='Example: 5025211001'
                name='noid'
                value={formData.noid}
                InputProps={{
                  readOnly: true
                }}
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

export default ViewUserAdmin
