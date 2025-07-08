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
  problem_id: string
  onClose?: () => void
  onUploadSuccess?: () => void
  onError?: (message?: string) => void
}

// interface CreatedUser {
//   id: string
//   username: string
//   name: string
//   email: string
//   noid: string
// }

// interface FailedUser {
//   noid: string
//   email: string
//   reason: string
// }

export default function AddTestCaseUpload({
  open = false,
  problem_id,
  onClose,
  onUploadSuccess,
  onError
}: AddUserUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  //   const [createdUsers, setCreatedUsers] = useState<CreatedUser[]>([])
  //   const [failedUsers, setFailedUsers] = useState<FailedUser[]>([])
  //   const [resultOpen, setResultOpen] = useState(false)

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
      const res = await fetchWithAuthFile(`/api/testcase/file/${problem_id}`, formData, 'POST')

      //   const created = res?.data?.created_users || []
      //   const failed = res?.data?.failed_users || []

      //   setCreatedUsers(created)
      //   setFailedUsers(failed)
      //   setResultOpen(true)
      handleCloseAll()

      onUploadSuccess?.() // refresh data
    } catch (err) {
      // console.log('masuk sini')
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
    // setResultOpen(false)
    onClose?.()
    setFile(null)
    // setCreatedUsers([])
    // setFailedUsers([])
  }

  return (
    <>
      {/* Upload Modal */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
        <DialogTitle>Add Test Case Using File</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <input type='file' accept='.zip' onChange={handleFileChange} />
            <Typography variant='body2'>
              Supported file types: <b>.zip</b>
            </Typography>
            <Typography variant='body2'>
              Download example format:&nbsp;
              <Link href='/example_files/users-success.csv' download underline='hover'>
                ZIP
              </Link>{' '}
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
    </>
  )
}
