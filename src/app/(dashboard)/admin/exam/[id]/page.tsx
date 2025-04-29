'use client'

import ProblemTable from '@/components/Table/Judge/ProblemTable'
import SessionTable from '@/components/Table/Judge/SessionTable'
import ViewExamJudge from '@/views/judge/view/ExamPageJudge'
import { useParams } from 'next/navigation'

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  return (
    <>
      {id && <ViewExamJudge id={id as string} />}

      {id && <ProblemTable exam_id={id as string} />}

      {id && <SessionTable exam_id={id as string} />}
    </>
  )
}

export default FormLayouts
