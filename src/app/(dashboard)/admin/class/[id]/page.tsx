'use client'

import EditUserClass from '@/views/class/edit/EditUserClass'
import ViewClass from '@/views/class/view/ViewClass'
import { useParams } from 'next/navigation'

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  return (
    <>
      {id && <ViewClass id={id as string} />}
      {id && <EditUserClass id={id as string} />}
    </>
  )
}

export default FormLayouts
