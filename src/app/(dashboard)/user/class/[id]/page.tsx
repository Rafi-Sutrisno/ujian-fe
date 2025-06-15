'use client'
import type { ReactElement } from 'react'

import dynamic from 'next/dynamic'

import { useParams } from 'next/navigation'

import SplitViewClassStudent from '@/views/user/split_views/ViewClassStudent'

const ViewClassStudent = dynamic(() => import('@/views/user/ViewClassStudent'))
const ExamTableStudent = dynamic(() => import('@/views/user/ExamTableStudent'))

const tabContentList = (id: string): { [key: string]: ReactElement } => ({
  class: <ViewClassStudent id={id as string} />,
  exam: <ExamTableStudent class_id={id as string} />
})

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  
return <SplitViewClassStudent tabContentList={tabContentList(id)} />
}

export default FormLayouts
