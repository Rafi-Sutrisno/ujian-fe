'use client'

// React Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import CardContent from '@mui/material/CardContent'
import { Box, Typography } from '@mui/material'

import { fetchWithAuth } from '@/utils/api'

declare global {
  interface Window {
    SafeExamBrowser?: any
  }
}

interface ViewExamProps {
  id: string
}

type Data = {
  user_id: string
  name: string
  no_id: string
  total_correct: number
  total_problem: number
}

const ViewResultStudent: React.FC<ViewExamProps> = ({ id }) => {
  // const router = useRouter()

  const [rows, setRows] = useState<Data>()
  const [err, setErr] = useState('')

  const fetchData = async () => {
    try {
      console.log(id)

      const data = await fetchWithAuth(`/api/submission/stats/user/exam/${id}`, undefined, 'GET')

      console.log('ini data: ', data)

      if (data.status && data.data) {
        const result = data.data

        const transformed: Data = {
          user_id: result.user_id,
          name: result.user_name,
          no_id: result.user_no_id,
          total_correct: result.total_correct,
          total_problem: result.total_problem
        }

        console.log('update:', transformed)
        setRows(transformed)
      } else {
        setErr(data.error)
        console.error('Failed to fetch exam:', data.message)
      }
    } catch (err) {
      console.error('Error fetching exam:', err)
    }
  }

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  return (
    <Card>
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
          <Typography variant='h5' fontWeight='bold'>
            View Exam Result
          </Typography>
        </Box>

        {err !== '' ? (
          <>{err}</>
        ) : (
          <Card sx={{ p: 4 }}>
            <Typography variant='h6' gutterBottom>
              User Submission Stats
            </Typography>

            <Grid container spacing={3}>
              {/* User Info */}
              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2' color='textSecondary'>
                  User ID
                </Typography>
                <Typography variant='body1'>{rows?.user_id || '-'}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2' color='textSecondary'>
                  Name
                </Typography>
                <Typography variant='body1'>{rows?.name || '-'}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2' color='textSecondary'>
                  No ID
                </Typography>
                <Typography variant='body1'>{rows?.no_id || '-'}</Typography>
              </Grid>

              {/* Submission Stats */}
              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2' color='textSecondary'>
                  Total Correct Answers
                </Typography>
                <Typography variant='body1' fontWeight='bold'>
                  {`${rows?.total_correct ?? 0} / ${rows?.total_problem ?? 0}`}
                </Typography>
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2' color='textSecondary'>
                  Total Problems
                </Typography>
                <Typography variant='body1' fontWeight='bold'>
                  {rows?.total_problem ?? 0}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2' color='textSecondary'>
                  Correct / Total
                </Typography>
                <Typography variant='body1' fontWeight='bold'>
                  {`${rows?.total_correct ?? 0} / ${rows?.total_problem ?? 0}`}
                </Typography>
              </Grid> */}

              {/* Percentage */}
              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2' color='textSecondary'>
                  Score
                </Typography>
                <Typography
                  variant='body1'
                  fontWeight='bold'
                  color={
                    rows?.total_problem && rows.total_correct / rows.total_problem >= 0.8
                      ? 'success.main'
                      : rows?.total_problem && rows.total_correct / rows.total_problem >= 0.5
                        ? 'warning.main'
                        : 'error.main'
                  }
                >
                  {rows?.total_problem ? `${((rows.total_correct / rows.total_problem) * 100).toFixed(1)}%` : '0%'}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

export default ViewResultStudent
