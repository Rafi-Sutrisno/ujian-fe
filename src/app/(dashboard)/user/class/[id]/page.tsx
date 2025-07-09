'use client'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import { useParams } from 'next/navigation'

import SplitViewClassStudent from '@/views/user/split_views/ViewClassStudent'

import { fetchWithAuth } from '@/utils/api'

const ViewClassStudent = dynamic(() => import('@/views/user/ViewClassStudent'))
const ExamTableStudent = dynamic(() => import('@/views/user/ExamTableStudent'))

const tabContentList = (id: string): { [key: string]: ReactElement } => ({
  class: <ViewClassStudent id={id as string} />,
  exam: <ExamTableStudent class_id={id as string} />
})

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  const [className, setClassName] = useState<string>('Loading...')

  useEffect(() => {
    const fetchClassName = async () => {
      const res = await fetchWithAuth(`/api/class/${id}`, undefined, 'GET')
      if (res.status && res.data) {
        setClassName(res.data.name + ' ' + res.data.class + ' (' + res.data.short_name + ') ')
      } else {
        setClassName('Unknown Class')
      }
    }

    if (id) fetchClassName()
  }, [id])

  return <SplitViewClassStudent tabContentList={tabContentList(id)} className={className} />
}

export default FormLayouts
