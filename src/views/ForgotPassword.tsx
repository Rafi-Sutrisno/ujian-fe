'use client'

// Next Imports
import { useState } from 'react'

import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Form from '@components/Form'
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'

const ForgotPassword = ({ mode }: { mode: Mode }) => {
  const serverPath = process.env.NEXT_PUBLIC_SERVER_URL

  // States
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${serverPath}/user/forgot_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      })

      // console.log('Forgot Password Response:', data)

      // You can show a success message or redirect here
      alert('Reset link sent! Please check your email.')
    } catch (error) {
      console.error('Forgot Password Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <Typography variant='h4'>Forgot Password 🔒</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>
              Enter your email and we&#39;ll send you instructions to reset your password
            </Typography>
            <Form noValidate autoComplete='off' className='flex flex-col gap-5' onSubmit={handleSubmit}>
              <TextField
                autoFocus
                fullWidth
                label='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Button fullWidth variant='contained' type='submit' disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>
              <Typography className='flex justify-center items-center' color='primary'>
                <Link href='/login' className='flex items-center'>
                  <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
                  <span>Back to Login</span>
                </Link>
              </Typography>
            </Form>
          </div>
        </CardContent>
      </Card>
      {/* <Illustrations maskImg={{ src: authBackground }} /> */}
    </div>
  )
}

export default ForgotPassword
