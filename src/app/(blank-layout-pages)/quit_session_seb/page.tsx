'use client'

import { useParams } from 'next/navigation'
import ExamFeedback from '@/views/user/ExamFeedback'

const ForgotPasswordPage = () => {
  const params = useParams()
  const id = params?.exam_id as string

  return <>{id && <ExamFeedback id={id} />}</>
}

export default ForgotPasswordPage
