'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'

import { Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import AssignUserUploadModal from '../form/AssignUserUpload'

interface ClassTopSectionProps {
  title?: string
  buttonText?: string
  modalContent?: ReactNode
  class_id: string
  onClose?: () => void
  onSave?: () => void
  onError?: (message?: string) => void
  recv?: boolean // Optional prop to control dialog width behavior
}

const TopSectionAssignUser = ({
  title = 'Class',
  buttonText = 'Add New Class',
  modalContent,
  class_id,
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
      <AssignUserUploadModal
        class_id={class_id}
        open={openUploadModal}
        onClose={handleCloseUpload}
        onUploadSuccess={handleSave}
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
              Assign User using file
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

export default TopSectionAssignUser
