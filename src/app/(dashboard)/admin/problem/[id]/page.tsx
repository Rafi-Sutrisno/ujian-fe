'use client'
import type { ReactElement } from 'react'
import dynamic from 'next/dynamic'

import { useParams } from 'next/navigation'
import SplitViewProblemAdmin from '@/views/admin/split_views/ViewProblemAdmin'

const ViewProblemAdmin = dynamic(() => import('@/views/admin/ViewProblemAdmin'))
const TestCaseTableAdmin = dynamic(() => import('@/views/admin/TestCaseTableAdmin'))

const tabContentList = (id: string): { [key: string]: ReactElement } => ({
  problem: <ViewProblemAdmin id={id as string} />,
  test_case: <TestCaseTableAdmin problem_id={id as string} />
})

const FormLayouts = () => {
  const params = useParams()
  const id = params?.id as string

  return <SplitViewProblemAdmin tabContentList={tabContentList(id)} />
}

export default FormLayouts
