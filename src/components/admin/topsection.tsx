'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'

interface TopSectionProps {
  title: string
  button: React.ReactNode
}

const TopSection: React.FC<TopSectionProps> = ({ title, button }) => {
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
      <Typography variant='h5' fontWeight={600}>
        {title}
      </Typography>
      {button}
    </Box>
  )
}

export default TopSection
