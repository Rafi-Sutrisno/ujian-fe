'use client'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import { useParams } from 'next/navigation'

import SplitViewProblemAdmin from '@/views/admin/split_views/ViewProblemAdmin'

import { fetchWithAuth } from '@/utils/api'

const ViewProblemAdmin = dynamic(() => import('@/views/admin/ViewProblemAdmin'))
const TestCaseTableAdmin = dynamic(() => import('@/views/admin/TestCaseTableAdmin'))

const tabContentList = (id: string): { [key: string]: ReactElement } => ({
  problem: <ViewProblemAdmin id={id as string} />,
  test_case: <TestCaseTableAdmin problem_id={id as string} />
})

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  const [problemName, setProblemName] = useState<string>('Loading...')

  useEffect(() => {
    const fetchClassName = async () => {
      const res = await fetchWithAuth(`/api/problem/${id}`, undefined, 'GET')
      if (res.status && res.data) {
        setProblemName('Problem: ' + res.data.title)
      } else {
        setProblemName('Unknown Class')
      }
    }

    if (id) fetchClassName()
  }, [id])

  return <SplitViewProblemAdmin tabContentList={tabContentList(id)} problemName={problemName} />
}

export default FormLayouts
