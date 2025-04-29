'use client'

import ViewExamParticipant from '@/views/participant/ExamPageParticipant'
import { useParams } from 'next/navigation'

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  return <>{id && <ViewExamParticipant id={id as string} />}</>
}

export default FormLayouts
