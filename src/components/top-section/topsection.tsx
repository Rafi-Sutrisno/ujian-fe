import Link from 'next/link'

import { Button, Box, Typography } from '@mui/material'

interface ClassTopSectionProps {
  title?: string
  buttonText?: string
  buttonLink?: string
}

const TopSection = ({
  title = 'Class',
  buttonText = 'Add New Class',
  buttonLink = '/class/create'
}: ClassTopSectionProps) => {
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
      <Typography variant='h5' fontWeight='bold'>
        {title}
      </Typography>
      <Link href={buttonLink} passHref>
        <Button variant='contained' color='primary'>
          {buttonText}
        </Button>
      </Link>
    </Box>
  )
}

export default TopSection
