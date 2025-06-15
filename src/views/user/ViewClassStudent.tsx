'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { fetchWithAuth } from '@/utils/api'

interface ViewClassProps {
  id: string
}

const ViewClassStudent: React.FC<ViewClassProps> = ({ id }) => {
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    class_name: '',
    short_name: ''
  })

  // const [snackbar, setSnackbar] = useState({
  //   open: false,
  //   message: '',
  //   severity: 'success' as 'success' | 'error'
  // })

  const fetchData = async () => {
    try {
      console.log(id)

      const data = await fetchWithAuth(`/api/class/${id}`, undefined, 'GET')

      console.log(data)

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

  return (
    <Card>
      <CardHeader title='View Class' />
      <CardContent>
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
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ViewClassStudent
