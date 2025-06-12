'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'next/navigation'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

const SplitViewPlaygroundStudent = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  const [activeTab, setActiveTab] = useState('playground')
  const [sessionInvalid, setSessionInvalid] = useState(false)
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  const checkExamSession = async () => {
    try {
      const check = await fetchWithAuth('/api/exam_session/check_session', undefined, 'GET')
      console.log('ini check:', check, check.status)
      if (!check.status) {
        setSessionInvalid(true)
      }
    } catch (err) {
      console.error('Session check failed:', err)
      setSessionInvalid(true)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      checkExamSession()
    }, 30000) // Cek setiap 30 detik

    return () => clearInterval(interval)
  }, [])

  const handleRedirect = () => {
    router.push('/user/exam')
  }

  return (
    <>
      <TabContext value={activeTab}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <TabList onChange={handleChange} variant='scrollable'>
              <Tab
                label='Playground'
                icon={<i className='ri-graduation-cap-line' />}
                iconPosition='start'
                value='playground'
              />

              <Tab
                label='Submission'
                icon={<i className='ri-file-list-3-line' />}
                iconPosition='start'
                value='submission'
              />
            </TabList>
          </Grid>
          <Grid item xs={12}>
            <TabPanel value={activeTab} className='p-0'>
              {tabContentList[activeTab]}
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
      <Dialog
        open={sessionInvalid}
        onClose={() => {}} // Required, but does nothing
        disableEscapeKeyDown
        BackdropProps={{ onClick: () => {} }}
      >
        <DialogTitle>Session Invalid</DialogTitle>
        <DialogContent>Your session has expired or is being used on another device.</DialogContent>
        <DialogActions>
          <Button onClick={handleRedirect} variant='contained'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SplitViewPlaygroundStudent
