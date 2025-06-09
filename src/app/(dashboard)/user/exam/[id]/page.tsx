'use client'

import dynamic from 'next/dynamic'
import type { ReactElement } from 'react'

// import ViewExamStudent from '@/views/user/ViewExamStudent'
import { useParams } from 'next/navigation'
import SplitViewExamStudent from '@/views/user/split_views/ViewExamStudent'

const ViewExamStudent = dynamic(() => import('@/views/user/ViewExamStudent'))
const ResultTableStudent = dynamic(() => import('@/views/user/ViewResultStudent'))

const tabContentList = (id: string): { [key: string]: ReactElement } => ({
  exam: <ViewExamStudent id={id as string} />,
  result: <ResultTableStudent id={id as string} />
})

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  return <SplitViewExamStudent tabContentList={tabContentList(id)} />
}

export default FormLayouts
