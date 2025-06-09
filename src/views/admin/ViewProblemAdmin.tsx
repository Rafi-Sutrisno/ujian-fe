'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TopSection2Modal from '@/components/top-section/topsection2modal'
import { Alert, Snackbar } from '@mui/material'

// React-Quill for rich text editing
import 'react-quill/dist/quill.snow.css' // Import styles
import EditorBasic from '@/components/Editor/EditorBasic'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '@/utils/api'

interface ViewProblemProps {
  id: string
}

const ViewProblemAdmin: React.FC<ViewProblemProps> = ({ id }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: ``,
    constraints: ``,
    sample_input: ``,
    sample_output: ``,
    cpu_time_limit: '',
    memory_limit: ''
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const fetchData = async () => {
    try {
      console.log(id)
      const data = await fetchWithAuth(`/api/problem/${id}`, undefined, 'GET')
      console.log(data)

      if (data.status && data.data) {
        const result = data.data
        setFormData({
          title: result.title,
          description: result.description,
          constraints: result.constraints,
          sample_input: result.sample_input,
          sample_output: result.sample_output,
          cpu_time_limit: result.cpu_time_limit,
          memory_limit: result.memory_limit
        })
      } else {
        console.error('Failed to fetch problem:', data.message)
      }
    } catch (err) {
      console.error('Error fetching problem:', err)
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

  const handleSubmit = async () => {
    const { title, description, constraints, sample_input, sample_output, cpu_time_limit, memory_limit } = formData
    console.log('data: ', title, description, constraints, sample_input, sample_output)

    if (!title || !description || !constraints || !sample_input || !sample_output) {
      console.log('all field required')
      return setSnackbar({
        open: true,
        message: 'All fields cant be null.',
        severity: 'error'
      })
    }

    const payload: any = { title, description, constraints, sample_input, sample_output }
    if (cpu_time_limit !== '') {
      payload.cpu_time_limit = parseFloat(cpu_time_limit)
    }
    if (memory_limit !== '') {
      payload.memory_limit = parseInt(memory_limit)
      if (payload.memory_limit <= 2048 && payload.memory_limit !== 0) {
        return setSnackbar({
          open: true,
          message: 'Memory limit must be greater than or equal to 2048',
          severity: 'error'
        })
      }
    }

    try {
      const result = await fetchWithAuth(`/api/problem/${id}`, payload, 'PATCH')

      if (result.status === false) {
        console.log(result)
        return setSnackbar({
          open: true,
          message: result?.message || 'Failed to update problem.',
          severity: 'error'
        })
      }

      console.log('Problem updated:', result)
      fetchData()
      setSnackbar({
        open: true,
        message: 'Problem updated successfully!',
        severity: 'success'
      })
    } catch (error) {
      console.error('Network error:', error)
      setSnackbar({
        open: true,
        message: 'Network error while updating problem.',
        severity: 'error'
      })
    }
  }

  const handleDelete = async () => {
    console.log('Problem Deleted:', formData.title)
    try {
      const result = await fetchWithAuth(`/api/problem/${id}`, undefined, 'DELETE')

      if (result.status === false) {
        console.log(result)
        return setSnackbar({
          open: true,
          message: result?.message || 'Failed to delete problem.',
          severity: 'error'
        })
      }

      console.log('Problem deleted:', result)

      setSnackbar({
        open: true,
        message: 'Problem deleted successfully!',
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
        message: 'Network error while updating problem.',
        severity: 'error'
      })
    }
  }

  const handleEditorChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <Card>
        <CardContent>
          <TopSection2Modal
            title='View Problem'
            primaryButtonText='Edit'
            onPrimarySave={handleSubmit}
            primaryModalContent={
              <CardContent>
                <form>
                  <Grid container spacing={5}>
                    <Grid item xs={12}>
                      <TextField fullWidth label='Title' name='title' value={formData.title} onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12}>
                      <p>Description</p>
                      <EditorBasic name='description' content={formData.description} onChange={handleEditorChange} />
                    </Grid>

                    <Grid item xs={12}>
                      <p>Constraints</p>
                      <EditorBasic name='constraints' content={formData.constraints} onChange={handleEditorChange} />
                    </Grid>

                    <Grid item xs={12}>
                      <p>Sample Input</p>
                      <EditorBasic name='sample_input' content={formData.sample_input} onChange={handleEditorChange} />
                    </Grid>

                    <Grid item xs={12}>
                      <p>Sample Output</p>
                      <EditorBasic
                        name='sample_output'
                        content={formData.sample_output}
                        onChange={handleEditorChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label='CPU Time Limit (seconds - Optional)'
                        name='cpu_time_limit'
                        type='number'
                        value={formData.cpu_time_limit}
                        onChange={e => handleEditorChange('cpu_time_limit', e.target.value)}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label='Memory Limit (kylobyte - Optional)'
                        name='memory_limit'
                        type='number'
                        value={formData.memory_limit}
                        onChange={e => handleEditorChange('memory_limit', e.target.value)}
                        fullWidth
                      />
                      <p>must be greater than or equal to 2048</p>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            }
            secondaryButtonText='Delete'
            secondaryModalContent={
              <Typography>
                Are you sure you want to delete the problem <strong>{formData?.title}</strong>?
              </Typography>
            }
            onSecondarySave={handleDelete}
          />
          <form>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Title'
                  name='title'
                  value={formData.title}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <p>Description</p>
                <div
                  className='description'
                  style={{
                    padding: '10px 14px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    color: '#000',
                    minHeight: '150px',
                    overflowY: 'auto'
                  }}
                  dangerouslySetInnerHTML={{ __html: formData.description }}
                />
              </Grid>

              <Grid item xs={12}>
                {/* <TextField
                fullWidth
                label='Constraints'
                name='constraints'
                value={formData.constraints}
                InputProps={{
                  readOnly: true
                }}
              /> */}
                <p>Constraints</p>
                <div
                  className='description'
                  style={{
                    padding: '10px 14px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    color: '#000',
                    minHeight: '80px',
                    overflowY: 'auto'
                  }}
                  dangerouslySetInnerHTML={{ __html: formData.constraints }}
                />
              </Grid>

              <Grid item xs={12}>
                <p>Sample Input</p>
                <div
                  className='description'
                  style={{
                    padding: '10px 14px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    color: '#000',
                    minHeight: '80px',
                    overflowY: 'auto'
                  }}
                  dangerouslySetInnerHTML={{ __html: formData.sample_input }}
                />
              </Grid>

              <Grid item xs={12}>
                <p>Sample Output</p>
                <div
                  className='description'
                  style={{
                    padding: '10px 14px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    color: '#000',
                    minHeight: '80px',
                    overflowY: 'auto'
                  }}
                  dangerouslySetInnerHTML={{ __html: formData.sample_output }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Cpu Time Limit'
                  placeholder=''
                  name='cpu_time_limit'
                  value={
                    formData.cpu_time_limit && formData.cpu_time_limit !== '0'
                      ? formData.cpu_time_limit
                      : 'default limit (2 sec)'
                  }
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Memory Limit'
                  placeholder=''
                  name='memory_limit'
                  value={
                    formData.memory_limit && formData.memory_limit !== '0'
                      ? formData.memory_limit
                      : 'default limit (128000 kylobyte)'
                  }
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

export default ViewProblemAdmin
