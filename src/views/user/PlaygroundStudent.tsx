'use client'

import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import CodeMirror from '@uiw/react-codemirror'

import {
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { ArrowBackIos, ArrowForwardIos, PlayArrow, Publish } from '@mui/icons-material'

import CircularProgress from '@mui/material/CircularProgress'

import { useTheme } from '@mui/material/styles'

import { fetchWithAuth } from '@/utils/api'

import Timer from '@/components/time/timer'
import { saveEncrypted, loadEncrypted, getStorageKey } from '@/utils/userState'
import { getTokenFromCookies, getUserIdFromToken } from '@/utils/token'

import { getExtensionsForCodeEditor } from '@/components/Editor/CodeEditor'

interface PlaygroundProps {
  exam_id: string
}

interface Data {
  id: string
  title: string
  description: string
  constraints: string
  sample_input: string
  sample_output: string
  created_at: string
}

type Language = {
  id: number
  name: string
  code: string
}

type ExamData = {
  id: string
  name: string
  short_name: string
  is_published: boolean
  start_time: string
  duration: string
  end_time: string
  allowed_languages: Language[]
}

const PlaygroundStudent: React.FC<PlaygroundProps> = ({ exam_id }) => {
  const router = useRouter()
  const [code, setCode] = useState(``)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [language, setLanguage] = useState(1)

  const [formData, setFormData] = useState<ExamData>({
    id: '',
    name: '',
    short_name: '',
    is_published: true,
    start_time: '',
    duration: '',
    end_time: '',
    allowed_languages: []
  })

  const [problems, setProblems] = useState<Data[]>([])
  const getStoredIndex = () => {
    const stored = localStorage.getItem('currentProblemIndex')
    return stored ? parseInt(stored, 10) : 0
  }

  const [currentProblemIndex, setCurrentProblemIndex] = useState(getStoredIndex)
  const currentProblem = problems[currentProblemIndex]

  useEffect(() => {
    localStorage.setItem('currentProblemIndex', currentProblemIndex.toString())
  }, [currentProblemIndex])

  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  // const token = getTokenFromCookies()
  const [userId, setUserId] = useState('anonymous')

  useEffect(() => {
    const token = getTokenFromCookies()

    if (token) {
      const id = getUserIdFromToken(token)

      setUserId(id || 'anonymous')
      // console.log('ini user id:', id)
    }
  }, [])

  useEffect(() => {
    if (!userId || !currentProblem) return

    const selectedLangCode = formData.allowed_languages.find(l => l.id === language)?.name

    if (!selectedLangCode) throw new Error('Selected language code not found')
    ;(async () => {
      const loadedCode = await loadEncrypted('code', userId, currentProblem.id, exam_id, selectedLangCode)
      const loadedInput = await loadEncrypted('input', userId, currentProblem.id, exam_id)
      const loadedOutput = await loadEncrypted('output', userId, currentProblem.id, exam_id)

      setCode(loadedCode)
      setInput(loadedInput)
      setOutput(loadedOutput)
    })()
  }, [userId, currentProblem, language])

  useEffect(() => {
    if (!userId || problems.length === 0) return

    const interval = setInterval(() => {
      problems.forEach(problem => {
        const selectedLangCode = formData.allowed_languages.find(l => l.id === language)?.name

        if (!selectedLangCode) return
        // console.log('masuk loop save draft')
        const problemId = problem.id

        // Read latest from localStorage
        const code = localStorage.getItem(getStorageKey('code', userId, problemId, exam_id, selectedLangCode))

        // Send to backend if code exists
        if (code) {
          fetchWithAuth(
            '/api/user/draft/save',
            {
              exam_id: exam_id,
              problem_id: problem.id,
              language: selectedLangCode,
              code: code
            },
            'POST'
          )
            .then(data => {
              // console.log(`Auto-saved for problem ${problem.id}`)
              // console.log('ini resp save draft:', data)
            })
            .catch(err => console.warn(`Failed to auto-save for problem ${problem.id}`, err))
        }
      })
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [userId, problems, formData.allowed_languages, language, exam_id])

  const handleCodeChange = (newCode: string) => {
    const selectedLangCode = formData.allowed_languages.find(l => l.id === language)?.name

    setCode(newCode)
    saveEncrypted('code', userId, currentProblem.id, newCode, exam_id, selectedLangCode)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    saveEncrypted('input', userId, currentProblem.id, e.target.value, exam_id)
  }

  const handleOutputChange = (newOutput: string) => {
    setOutput(newOutput)

    if (currentProblem) {
      saveEncrypted('output', userId, currentProblem.id, newOutput, exam_id)
    }
  }

  const extensions = useMemo(
    () => getExtensionsForCodeEditor(formData.allowed_languages.find(l => l.id === language)?.name || 'C', isDarkMode),
    [language, isDarkMode]
  )

  const fetchDataProblem = async () => {
    try {
      const data = await fetchWithAuth(`/api/problem/exam/${exam_id}`, undefined, 'GET')

      // console.log('ini problem: ', data)

      if (data.status && Array.isArray(data.data)) {
        setProblems(data.data)
      } else {
        console.error('Failed to fetch problems:', data.message)
      }
    } catch (error) {
      console.error('Error fetching problems:', error)
    }
  }

  const fetchData = async () => {
    try {
      // console.log(exam_id)

      const data = await fetchWithAuth(`/api/exam/${exam_id}`, undefined, 'GET')

      // console.log(data)

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
          allowed_languages: result.allowed_languages
        })
        setLanguage(result.allowed_languages[0].id)
      } else {
        console.error('Failed to fetch exam:', data.message)
      }
    } catch (err) {
      console.error('Error fetching exam:', err)
    }
  }

  useEffect(() => {
    if (exam_id) {
      const fetchSequentially = async () => {
        try {
          await fetchData()
          await fetchDataProblem()
        } catch (err) {
          console.error('Error fetching data:', err)
        }
      }

      fetchSequentially()
    }
  }, [exam_id])

  const handleRun = async () => {
    setLoading(true)
    try {
      const encodedCode = btoa(code)
      const encodedInput = btoa(input)

      const payload = {
        language_id: language,
        source_code: encodedCode,
        stdin: encodedInput
      }
      const result = await fetchWithAuth(`/api/submission/run/${exam_id}`, payload, 'POST')

      if (result.status) {
        const res = result.data

        if (res.status?.id === 3) {
          const decodedOutput = atob(res.stdout || '')

          handleOutputChange(decodedOutput)
        } else {
          const errorOutput = res.compile_output || res.stderr || 'Unknown error occurred'
          const decodedError = atob(errorOutput)
          handleOutputChange(`Error: ${decodedError}`)
          setLoading(false)
        }
      } else {
        setSnackbar({
          open: true,
          message: result?.error || 'Failed to run code.',
          severity: 'error'
        })
      }
    } catch (err) {
      console.error('Error during code execution:', err)
      handleOutputChange('Failed to run code.')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoadingSubmit(true)

    try {
      const encodedCode = code

      const payload = {
        language_id: language,
        source_code: encodedCode,
        exam_id: exam_id,
        problem_id: currentProblem.id
      }

      const result = await fetchWithAuth(`/api/submission/submit/${exam_id}`, payload, 'POST')

      if (result.status) {
        setSnackbar({
          open: true,
          message: result?.message || 'Success submit code.',
          severity: 'success'
        })
      } else {
        setSnackbar({
          open: true,
          message: result?.error || 'Failed to submit code.',
          severity: 'error'
        })
      }
    } catch (err) {
      console.error('Error during code submission:', err)
      setSnackbar({
        open: true,
        message: 'Failed to submit code.',
        severity: 'error'
      })

      // setOutput('Failed to run code. Please try again.')
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleFinishExam = () => {
    setConfirmOpen(true)
  }

  const confirmFinishExam = async () => {
    setConfirmOpen(false)
    const result = await fetchWithAuth(`/api/exam_session/finish_exam/${exam_id}`, {}, 'POST')

    // console.log('ini result finish exam:', result)
    router.push(`/exam_feedback/${exam_id}`)
  }

  const cancelFinishExam = () => {
    setConfirmOpen(false)
  }

  return (
    <Card>
      {/* <CardHeader title='C Code Playground' /> */}
      <CardContent>
        <Grid container justifyContent='space-between' style={{ marginBottom: '20px' }}>
          {currentProblem && (
            <>
              <Typography variant='h2' fontWeight='bold'>
                {currentProblem.title}
              </Typography>
            </>
          )}

          <Button variant='contained' color='error' onClick={handleFinishExam}>
            Finish Exam
          </Button>
        </Grid>

        <Grid item style={{ marginBottom: '20px' }}>
          <Select
            size='small'
            value={currentProblemIndex}
            onChange={e => setCurrentProblemIndex(Number(e.target.value))}
            displayEmpty
            style={{ minWidth: 200 }}
          >
            {problems.map((problem, index) => (
              <MenuItem key={problem.id} value={index}>
                {`${index + 1}. ${problem.title}`}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid
          container
          alignItems='center'
          justifyContent='space-between'
          spacing={2}
          sx={{ mb: 2 }}
          style={{ marginBottom: '20px' }}
        >
          {/* Left: Prev / Next Buttons */}
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => setCurrentProblemIndex(i => Math.max(i - 1, 0))}
                  disabled={currentProblemIndex === 0}
                >
                  <ArrowBackIos />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => setCurrentProblemIndex(i => Math.min(i + 1, problems.length - 1))}
                  disabled={currentProblemIndex === problems.length - 1}
                >
                  <ArrowForwardIos />
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Center: Run / Submit Buttons */}
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={handleRun}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                >
                  {loading ? 'Running...' : 'Run'}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='outlined'
                  color='success'
                  onClick={handleSubmit}
                  disabled={loadingSubmit}
                  startIcon={loadingSubmit ? <CircularProgress size={20} /> : <Publish />}
                >
                  {loadingSubmit ? 'Submitting...' : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Right: Timer */}
          <Grid item>
            {/* <Typography variant='h3' fontWeight='bold'>
              01:23:45
            </Typography> */}
            <Timer endTime={formData.end_time} onTimeUp={confirmFinishExam} />
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ border: '2px solid gray', borderRadius: '5px', height: '700px' }}>
          {/* LEFT: Problem Info */}
          <Grid item xs={12} md={6} style={{ borderRight: '2px solid gray', overflowY: 'scroll', maxHeight: '700px' }}>
            {currentProblem && (
              <>
                <Typography variant='h6' fontWeight='bold'>
                  {currentProblem.title}
                </Typography>
                <Typography dangerouslySetInnerHTML={{ __html: currentProblem.description }} sx={{ mb: 2 }} />
                <Typography>
                  <strong>Constraints:</strong>{' '}
                  <span dangerouslySetInnerHTML={{ __html: currentProblem.constraints }} />
                </Typography>
                <Typography>
                  <strong>Sample Input:</strong>{' '}
                  <span dangerouslySetInnerHTML={{ __html: currentProblem.sample_input }} />
                </Typography>
                <Typography>
                  <strong>Sample Output:</strong>{' '}
                  <span dangerouslySetInnerHTML={{ __html: currentProblem.sample_output }} />
                </Typography>
              </>
            )}
          </Grid>

          {/* RIGHT: Code + Input/Output */}
          <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Grid
              item
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px',
                borderBottom: '2px solid gray',
                padding: '5px'
              }}
            >
              <p>Code Editor</p>
              <FormControl size='small' style={{ minWidth: 120 }}>
                <InputLabel id='language-select-label'>Language</InputLabel>
                <Select
                  labelId='language-select-label'
                  value={language}
                  label='Language'
                  onChange={e => setLanguage(Number(e.target.value))}
                >
                  {formData.allowed_languages.map(lang => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Code Editor */}
            <Grid
              item
              style={{ marginBottom: '20px', borderBottom: '2px solid gray', padding: '5px' }}
              sx={{
                '& .cm-editor': {
                  backgroundColor: isDarkMode ? 'black !important' : undefined
                }
              }}
            >
              <CodeMirror value={code} height='400px' extensions={extensions} onChange={handleCodeChange} />
            </Grid>

            <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
              {/* Input */}
              <div
                style={{
                  width: '50%',
                  paddingRight: '8px',
                  boxSizing: 'border-box',
                  height: '100%',
                  overflow: 'auto'
                }}
              >
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Input</label>
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  wrap='off' // This disables word wrapping
                  style={{
                    width: '100%',
                    height: '80%',
                    resize: 'none',
                    overflow: 'auto',
                    whiteSpace: 'pre', // Ensures text doesn't wrap
                    fontFamily: 'monospace',
                    padding: '8px',
                    boxSizing: 'border-box',
                    backgroundColor: 'transparent', // <-- transparent here
                    color: 'inherit', // optional: inherit text color from parent
                    border: '1px solid #ccc' // optional: keep border visible
                  }}
                />
              </div>

              {/* Output */}
              <div
                style={{
                  width: '50%',
                  paddingLeft: '8px',
                  boxSizing: 'border-box',
                  height: '100%',
                  overflow: 'auto'
                }}
              >
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Output</label>
                <textarea
                  value={output}
                  readOnly
                  wrap='off'
                  style={{
                    width: '100%',
                    height: '80%',
                    resize: 'none',
                    overflow: 'auto',
                    whiteSpace: 'pre',
                    fontFamily: 'monospace',
                    padding: '8px',
                    boxSizing: 'border-box',
                    backgroundColor: 'transparent', // <-- transparent here
                    color: 'inherit', // optional: inherit text color from parent
                    border: '1px solid #ccc' // optional: keep border visible
                  }}
                />
              </div>
            </div>
          </Grid>
        </Grid>
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

      <Dialog open={confirmOpen} onClose={cancelFinishExam}>
        <DialogTitle>Confirm Finish</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to finish the exam? You won&apos;t be able to return.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelFinishExam}>Cancel</Button>
          <Button onClick={confirmFinishExam} color='error' variant='contained'>
            Yes, Finish
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default PlaygroundStudent
