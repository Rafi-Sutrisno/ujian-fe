'use client'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

// import ViewClassAdmin from '@/views/admin/ViewClassAdmin'
// import UserClassTableAdmin from '@/views/admin/UserClassTableAdmin'
// import ExamTableAdmin from '@/components/Table/Admin/ExamTableAdmin'

import { useParams } from 'next/navigation'

import SplitViewClassAdmin from '@/views/admin/split_views/ViewClassAdmin'

import { fetchWithAuth } from '@/utils/api'

const ViewClassAdmin = dynamic(() => import('@/views/admin/ViewClassAdmin'))
const UserClassTableAdmin = dynamic(() => import('@/views/admin/UserClassTableAdmin'))
const ExamTableAdmin = dynamic(() => import('@/views/admin/ExamTableAdmin'))

const tabContentList = (id: string): { [key: string]: ReactElement } => ({
  class: <ViewClassAdmin id={id as string} />,
  participant: <UserClassTableAdmin id={id as string} />,
  exam: <ExamTableAdmin class_id={id as string} />
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

  return <SplitViewClassAdmin tabContentList={tabContentList(id)} className={className} />
}

export default FormLayouts
