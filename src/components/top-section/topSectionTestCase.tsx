'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'

import { Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import AddTestCaseUpload from '../form/AddTestCaseUpload'

interface ClassTopSectionProps {
  title?: string
  buttonText?: string
  problem_id: string
  modalContent?: ReactNode
  onUploadSuccess?: () => void
  onClose?: () => void
  onSave?: () => void
  onError?: (message?: string) => void
  recv?: boolean // Optional prop to control dialog width behavior
}

const TopSectionTestCase = ({
  title = 'Class',
  buttonText = 'Add New Class',
  modalContent,
  problem_id,
  onUploadSuccess,
  onClose,
  onSave,
  onError,
  recv = true // Default to true, making it fullWidth and maxWidth='xl'
}: ClassTopSectionProps) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    onClose?.()
    setOpen(false)
  }

  const handleUploadSuccess = () => {
    onUploadSuccess?.()
    setOpen(false)
  }

  const handleSave = () => {
    onSave?.()
    setOpen(false)
  }

  const [openUploadModal, setOpenUploadModal] = useState(false)

  const handleOpenUpload = () => setOpenUploadModal(true)
  const handleCloseUpload = () => setOpenUploadModal(false)

  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
        <Typography variant='h5' fontWeight='bold'>
          {title}
        </Typography>
        <Button variant='contained' color='primary' onClick={handleOpen}>
          {buttonText}
        </Button>
      </Box>

      <AddTestCaseUpload
        problem_id={problem_id}
        open={openUploadModal}
        onClose={handleCloseUpload}
        onUploadSuccess={handleUploadSuccess}
        onError={onError}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={recv} // Apply fullWidth if recv is true
        maxWidth={recv ? 'xl' : 'sm'} // Set maxWidth to 'xl' if recv is true, otherwise 'sm'
      >
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
            <Typography variant='h5'>{buttonText}</Typography>

            <Button variant='contained' color='primary' onClick={handleOpenUpload}>
              Add New Test Case Using File
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>{modalContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='inherit'>
            Cancel
          </Button>
          <Button onClick={handleSave} variant='contained' color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TopSectionTestCase
