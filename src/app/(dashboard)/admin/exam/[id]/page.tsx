'use client'

import ProblemTable from '@/components/Table/Judge/ProblemTable'
import ViewExamJudge from '@/views/judge/view/ExamPageJudge'
import { useParams } from 'next/navigation'

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  return (
    <>
      {id && <ViewExamJudge id={id as string} />}

      {id && <ProblemTable exam_id={id as string} />}
    </>
  )
}

export default FormLayouts
