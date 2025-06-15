import { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Link
} from '@mui/material'

import { fetchWithAuthFile } from '@/utils/api'

interface AddUserUploadModalProps {
  open?: boolean
  onClose?: () => void
  onUploadSuccess?: () => void
  onError?: (message?: string) => void
}

interface CreatedUser {
  id: string
  username: string
  name: string
  email: string
  noid: string
}

interface FailedUser {
  noid: string
  email: string
  reason: string
}

export default function AddUserUploadModal({
  open = false,
  onClose,
  onUploadSuccess,
  onError
}: AddUserUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [createdUsers, setCreatedUsers] = useState<CreatedUser[]>([])
  const [failedUsers, setFailedUsers] = useState<FailedUser[]>([])
  const [resultOpen, setResultOpen] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()

    formData.append('file', file)

    setUploading(true)

    try {
      const res = await fetchWithAuthFile('/api/user/upload-file', formData, 'POST')

      const created = res?.data?.created_users || []
      const failed = res?.data?.failed_users || []

      setCreatedUsers(created)
      setFailedUsers(failed)
      setResultOpen(true)

      onUploadSuccess?.() // refresh data
    } catch (err) {
      console.log('masuk sini')
      let message = 'Failed to upload file.'

      try {
        const error = err as Error
        const parsed = JSON.parse(error.message.replace(/^.*?\{/, '{')) // sanitize in case there's prefix text

        message = parsed.error || parsed.message || message
      } catch (e) {
        console.error('Could not parse error message:', err)
      }

      onError?.(message)
    } finally {
      setUploading(false)
    }
  }

  const handleCloseAll = () => {
    setResultOpen(false)
    onClose?.()
    setFile(null)
    setCreatedUsers([])
    setFailedUsers([])
  }

  return (
    <>
      {/* Upload Modal */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
        <DialogTitle>Upload Users File</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <input type='file' accept='.yaml,.yml,.csv' onChange={handleFileChange} />
            <Typography variant='body2'>
              Supported file types: <b>.csv</b>, <b>.yaml</b>, or <b>.yml</b>
            </Typography>
            <Typography variant='body2'>
              Download example format:&nbsp;
              <Link href='/example/example.csv' download underline='hover'>
                CSV
              </Link>{' '}
              |{' '}
              <Link href='/example/example.yaml' download underline='hover'>
                YAML
              </Link>
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant='outlined' color='inherit'>
            Cancel
          </Button>
          <Button onClick={handleUpload} variant='contained' color='primary' disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={resultOpen} onClose={handleCloseAll} fullWidth maxWidth='md'>
        <DialogTitle>Upload Result</DialogTitle>
        <DialogContent dividers>
          {createdUsers.length > 0 && (
            <>
              <Typography variant='h6' gutterBottom>
                ✅ Created Users
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>NOID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {createdUsers.map((user, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.noid}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {failedUsers.length > 0 && (
            <>
              <Typography variant='h6' gutterBottom>
                ❌ Failed Users
              </Typography>
              <TableContainer component={Paper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>NOID</TableCell>
                      <TableCell>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {failedUsers.map((user, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.noid}</TableCell>
                        <TableCell>{user.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {createdUsers.length === 0 && failedUsers.length === 0 && (
            <Typography>No results returned from the server.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAll} variant='contained' color='primary'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
