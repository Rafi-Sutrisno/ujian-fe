'use client'

import ExamPlayground from '@/views/participant/playground/playground'
import { useParams } from 'next/navigation'
const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string
  return <>{id && <ExamPlayground id={id as string} />}</>
}

export default FormLayouts
