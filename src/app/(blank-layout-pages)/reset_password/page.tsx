'use client'

import { useSearchParams } from 'next/navigation'
import ResetPassword from '@/views/ResetPassword'

const ForgotPasswordPage = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  return <>{token && <ResetPassword token={token} />}</>
}

export default ForgotPasswordPage
