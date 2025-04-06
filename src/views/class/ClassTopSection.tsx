import Link from 'next/link'
import { Button } from '@mui/material'
import { Box, Typography } from '@mui/material'

const ClassTopSection = () => {
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
      <Typography variant='h5' fontWeight='bold'>
        Class
      </Typography>
      <Link href='/class/create' passHref>
        <Button variant='contained' color='primary'>
          Add New Class
        </Button>
      </Link>
    </Box>
  )
}

export default ClassTopSection
