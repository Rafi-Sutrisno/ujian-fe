'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'

// API Utility
import { fetchWithAuth } from '@/utils/api'

const AccountDetails = () => {
  // States
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    noid: '',
    role_id: 2,
    email: ''
  })

  const fetchData = async () => {
    try {
      const data = await fetchWithAuth(`/api/user/me`, undefined, 'GET')

      if (data.status && data.data) {
        const result = data.data

        setFormData({
          id: result.id,
          name: result.name,
          noid: result.noid,
          email: result.email,
          role_id: result.role_id
        })
      } else {
        console.error('Failed to fetch user:', data.message)
      }
    } catch (err) {
      console.error('Error fetching user:', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data = await fetchWithAuth(
        `/api/user/me`,
        { email: formData.email }, // <-- correct format here
        'PATCH'
      )

      if (!data.status) {
        console.error('Failed to update user:', data.message)
        return
      }

      console.log('User updated successfully:', data)

      // Refresh the data after successful update
      fetchData()
    } catch (error) {
      console.error('Network error:', error)
    }
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-2 items-start'>
        <Typography variant='h4' fontWeight='bold'>
          Hello, {formData.name || 'User'}!
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          You can only update your email address.
        </Typography>
      </CardContent>

      <Divider />

      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Name'
              value={formData.name}
              name='name'
              placeholder='John'
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='NRP'
              value={formData.noid}
              name='noid'
              placeholder='12345678'
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Role'
              value={formData.role_id}
              name='role_id'
              placeholder='Student'
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 items-start w-full'>
          <Typography variant='h6' fontWeight='medium'>
            Update Email
          </Typography>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Email'
                value={formData.email}
                name='email'
                placeholder='john.doe@gmail.com'
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button variant='contained' type='submit'>
            Update Email
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
