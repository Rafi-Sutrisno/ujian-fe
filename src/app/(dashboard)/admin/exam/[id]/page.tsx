'use client'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

// import ExamProblemTableAdmin from '@/views/admin/ExamProblemTableAdmin'
// import SessionTableAdmin from '@/views/admin/SessionTableAdmin'
// import ViewExamAdmin from '@/views/admin/ViewExamAdmin'
import { useParams } from 'next/navigation'

import SplitViewExamAdmin from '@/views/admin/split_views/ViewExamAdmin'

import { fetchWithAuth } from '@/utils/api'

const ViewExamAdmin = dynamic(() => import('@/views/admin/ViewExamAdmin'))
const ExamProblemTableAdmin = dynamic(() => import('@/views/admin/ExamProblemTableAdmin'))
const SessionTableAdmin = dynamic(() => import('@/views/admin/SessionTableAdmin'))
const SubmissionTableAdmin = dynamic(() => import('@/views/admin/SubmissionTableAdmin'))
const ResultTableAdmin = dynamic(() => import('@/views/admin/ResultTableAdmin'))

const tabContentList = (id: string): { [key: string]: ReactElement } => ({
  exam: <ViewExamAdmin id={id as string} />,
  problem: <ExamProblemTableAdmin exam_id={id as string} />,
  session: <SessionTableAdmin exam_id={id as string} />,
  submission: <SubmissionTableAdmin exam_id={id as string} />,
  result: <ResultTableAdmin exam_id={id as string} />
})

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  const [examName, setExamName] = useState<string>('Loading...')

  useEffect(() => {
    const fetchClassName = async () => {
      const res = await fetchWithAuth(`/api/exam/${id}`, undefined, 'GET')
      if (res.status && res.data) {
        setExamName(res.data.name + ' (' + res.data.short_name + ') ')
      } else {
        setExamName('Unknown Class')
      }
    }

    if (id) fetchClassName()
  }, [id])

  return <SplitViewExamAdmin tabContentList={tabContentList(id)} examName={examName} />
}

export default FormLayouts
