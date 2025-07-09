'use client'

import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

// import ViewExamStudent from '@/views/user/ViewExamStudent'
import { useParams } from 'next/navigation'

import SplitViewExamStudent from '@/views/user/split_views/ViewExamStudent'

import { fetchWithAuth } from '@/utils/api'

const ViewExamStudent = dynamic(() => import('@/views/user/ViewExamStudent'))
const ResultTableStudent = dynamic(() => import('@/views/user/ViewResultStudent'))

const tabContentList = (id: string): { [key: string]: ReactElement } => ({
  exam: <ViewExamStudent id={id as string} />,
  result: <ResultTableStudent id={id as string} />
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

  return <SplitViewExamStudent tabContentList={tabContentList(id)} examName={examName} />
}

export default FormLayouts
