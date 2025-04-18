'use client'

import { useParams } from 'next/navigation'
import ViewUser from '@/views/user/view/ViewUser'

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  return <>{id && <ViewUser id={id as string} />}</>
}

export default FormLayouts
