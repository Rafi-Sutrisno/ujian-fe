'use client'

import { useParams } from 'next/navigation'
import ViewUserAdmin from '@/views/admin/ViewUserAdmin'

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  return <>{id && <ViewUserAdmin id={id as string} />}</>
}

export default FormLayouts
