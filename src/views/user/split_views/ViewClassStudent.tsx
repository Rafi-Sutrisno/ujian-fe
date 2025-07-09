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

const SplitViewClassStudent = ({
  tabContentList,
  className
}: {
  tabContentList: { [key: string]: ReactElement }
  className: string
}) => {
  // States
  const [activeTab, setActiveTab] = useState('class')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <h2 style={{ marginBottom: 0 }}>{className}</h2>
        </Grid>

        <Grid item xs={12}>
          <TabList onChange={handleChange} variant='scrollable'>
            <Tab label='Class' icon={<i className='ri-graduation-cap-line' />} iconPosition='start' value='class' />

            {/* <Tab label='Participant' icon={<i className='ri-group-line' />} iconPosition='start' value='participant' /> */}

            <Tab label='Exam' icon={<i className='ri-file-list-3-line' />} iconPosition='start' value='exam' />
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

export default SplitViewClassStudent
