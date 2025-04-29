'use client'
import ViewClassStudent from '@/views/participant/ClassPageStudent'
import UserTable from '@/components/Table/Judge/UserTable'
import ExamTableParticipant from '@/components/Table/Participant/ExamTable'
import { useParams } from 'next/navigation'

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string
  return (
    <>
      {id && <ViewClassStudent id={id as string} />}

      {/* <UserTable /> */}

      {id && <ExamTableParticipant class_id={id as string} />}
    </>
  )
}

export default FormLayouts
