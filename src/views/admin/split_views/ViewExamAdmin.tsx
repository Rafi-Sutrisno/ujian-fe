'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

const SplitViewExamAdmin = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  const [activeTab, setActiveTab] = useState('exam')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TabList onChange={handleChange} variant='scrollable'>
            <Tab label='Exam' icon={<i className='ri-file-paper-2-line' />} iconPosition='start' value='exam' />

            <Tab label='Problem' icon={<i className='ri-question-line' />} iconPosition='start' value='problem' />

            <Tab label='Session' icon={<i className='ri-time-line' />} iconPosition='start' value='session' />

            <Tab
              label='Submission'
              icon={<i className='ri-file-list-3-line' />}
              iconPosition='start'
              value='submission'
            />

            <Tab label='Result' icon={<i className='ri-file-list-3-line' />} iconPosition='start' value='result' />
          </TabList>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={activeTab} className='p-0'>
            {tabContentList[activeTab]}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default SplitViewExamAdmin
