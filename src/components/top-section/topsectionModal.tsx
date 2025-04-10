'use client'

import { useState, ReactNode } from 'react'
import { Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

interface ClassTopSectionProps {
  title?: string
  buttonText?: string
  modalContent?: ReactNode
  onClose?: () => void
  onSave?: () => void
}

const TopSectionModal = ({
  title = 'Class',
  buttonText = 'Add New Class',
  modalContent,
  onClose,
  onSave
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xl'>
        <DialogTitle>{buttonText}</DialogTitle>
        <DialogContent>{modalContent}</DialogContent>
        <DialogActions className=''>
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

export default TopSectionModal
