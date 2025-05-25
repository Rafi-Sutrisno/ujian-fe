'use client'

import ViewExamStudent from '@/views/student/ViewExamStudent'
import { useParams } from 'next/navigation'

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  return <>{id && <ViewExamStudent id={id as string} />}</>
}

export default FormLayouts
