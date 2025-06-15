'use client'

import type { ReactNode } from 'react';
import { useState } from 'react'

import { Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

interface ClassTopSectionProps {
  title?: string

  primaryButtonText?: string
  primaryModalContent?: ReactNode
  onPrimaryClose?: () => void
  onPrimarySave?: () => void // Updated this to remove the event parameter

  secondaryButtonText?: string
  secondaryModalContent?: ReactNode
  onSecondaryClose?: () => void
  onSecondarySave?: () => void // Updated this to remove the event parameter
}

const TopSection2Modal = ({
  title = 'Class',

  primaryButtonText = 'Add New Class',
  primaryModalContent,
  onPrimaryClose,
  onPrimarySave,

  secondaryButtonText = 'Import Class',
  secondaryModalContent,
  onSecondaryClose,
  onSecondarySave
}: ClassTopSectionProps) => {
  const [openPrimary, setOpenPrimary] = useState(false)
  const [openSecondary, setOpenSecondary] = useState(false)

  const handleOpenPrimary = () => setOpenPrimary(true)

  const handleClosePrimary = () => {
    onPrimaryClose?.()
    setOpenPrimary(false)
  }

  const handleSavePrimary = () => {
    onPrimarySave?.() // Calls the provided save function without any parameters
    setOpenPrimary(false)
  }

  const handleOpenSecondary = () => setOpenSecondary(true)

  const handleCloseSecondary = () => {
    onSecondaryClose?.()
    setOpenSecondary(false)
  }

  const handleSaveSecondary = () => {
    onSecondarySave?.() // Calls the provided save function without any parameters
    setOpenSecondary(false)
  }

  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
        <Typography variant='h5' fontWeight='bold'>
          {title}
        </Typography>
        <Box display='flex' gap={2}>
          <Button variant='contained' color='primary' onClick={handleOpenPrimary}>
            {primaryButtonText}
          </Button>
          <Button variant='outlined' color='error' onClick={handleOpenSecondary}>
            {secondaryButtonText}
          </Button>
        </Box>
      </Box>

      {/* Primary Modal */}
      <Dialog open={openPrimary} onClose={handleClosePrimary} fullWidth maxWidth='xl'>
        <DialogTitle>{primaryButtonText}</DialogTitle>
        <DialogContent>{primaryModalContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrimary} color='inherit'>
            Cancel
          </Button>
          <Button onClick={handleSavePrimary} variant='contained' color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Secondary Modal */}
      <Dialog open={openSecondary} onClose={handleCloseSecondary} fullWidth maxWidth='xl'>
        <DialogTitle>{secondaryButtonText}</DialogTitle>
        <DialogContent>{secondaryModalContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSecondary} color='inherit'>
            Cancel
          </Button>
          <Button onClick={handleSaveSecondary} variant='contained' color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TopSection2Modal
