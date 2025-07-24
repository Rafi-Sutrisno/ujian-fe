import { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, Link } from '@mui/material'

import { fetchWithAuthFile } from '@/utils/api'

interface AddExamUploadModalProps {
  open?: boolean
  class_id: string
  onClose?: () => void
  onUploadSuccess?: () => void
  onError?: (message?: string) => void
}

export default function AddExamUploadModal({
  class_id,
  open = false,
  onClose,
  onError,
  onUploadSuccess
}: AddExamUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
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
      const res = await fetchWithAuthFile(`/api/exam/yaml/${class_id}`, formData, 'POST')

      if (res.status === false) {
        console.error('Upload failed:', res)
        onError?.(res?.error)
      }

      // setResultOpen(true)

      onUploadSuccess?.() // refresh data
    } catch (err) {
      let message = 'Failed to upload file.'

      try {
        const error = err as Error
        const parsed = JSON.parse(error.message.replace(/^.*?\{/, '{')) // sanitize in case there's prefix text

        message = parsed.error || parsed.message || message
      } catch (e) {
        console.error('Could not parse error message:', e)
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
  }

  return (
    <>
      {/* Upload Modal */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
        <DialogTitle>Create Exam Using File</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <input type='file' accept='.yaml,.yml,.csv' onChange={handleFileChange} />
            <Typography variant='body2'>
              Supported file types: <b>.yaml</b>, or <b>.yml</b>
            </Typography>
            <Typography variant='body2'>
              Download example format:&nbsp;
              <Link href='/example_files/exam-success.yaml' download underline='hover'>
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
        <DialogContent dividers></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAll} variant='contained' color='primary'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
