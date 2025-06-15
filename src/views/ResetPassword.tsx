'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Form from '@components/Form'
import DirectionalIcon from '@components/DirectionalIcon'
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'
import { useImageVariant } from '@core/hooks/useImageVariant'

const ResetPassword = ({ token }: { token: string }) => {
  const serverPath = process.env.NEXT_PUBLIC_SERVER_URL

  const mode = 'light' // fallback until you properly detect theme
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const router = useRouter()

  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${serverPath}/api/user/reset_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
        credentials: 'include'
      })

      const data = await res.json()

      if (res.ok) {
        alert('Password has been reset successfully!')
        router.push('/login')
      } else {
        alert(data.error || 'Failed to reset password')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong!')
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
          <Typography variant='h4'>Reset Password 🔒</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>Please enter your new password below</Typography>
            <Form noValidate autoComplete='off' className='flex flex-col gap-5' onSubmit={handleSubmit}>
              <TextField
                autoFocus
                fullWidth
                label='New Password'
                type='password'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <Button fullWidth variant='contained' type='submit' disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
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
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default ResetPassword
