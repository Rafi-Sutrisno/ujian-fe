'use client'

import type { ReactElement } from 'react'

import dynamic from 'next/dynamic'

import { useParams } from 'next/navigation'

import SplitViewPlaygroundStudent from '@/views/user/split_views/PlagroundStudent'

const PlaygroundStudent = dynamic(() => import('@/views/user/PlaygroundStudent'))
const SubmissionTableStudent = dynamic(() => import('@/views/user/SubmissionTableStudent'))

const tabContentList = (id: string): { [key: string]: ReactElement } => ({
  playground: <PlaygroundStudent exam_id={id as string} />,
  submission: <SubmissionTableStudent exam_id={id as string} />
})

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  
return <SplitViewPlaygroundStudent tabContentList={tabContentList(id)} />
}

export default FormLayouts
