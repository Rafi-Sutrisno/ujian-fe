'use client'

// MUI Imports
import ViewProblemJudge from '@/views/judge/view/ProblemPageJudge'
import TestCaseTable from '@/components/Table/Judge/TestCaseTable'
import { useParams } from 'next/navigation'

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  return (
    <>
      {id && <ViewProblemJudge id={id as string} />}

      {id && <TestCaseTable problem_id={id as string} />}
    </>
  )
}

export default FormLayouts
