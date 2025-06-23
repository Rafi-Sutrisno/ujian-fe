'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'
import { Button, Box, Typography, Link } from '@mui/material'

import { fetchWithAuth } from '@/utils/api'

interface ExamFeedbackProps {
  id: string
}

interface LangData {
  id: string
  name: string
  code: string
}

type FormData = {
  id: string
  name: string
  short_name: string
  is_published: boolean
  start_time: string
  duration: string
  end_time: string

  is_seb_restricted: boolean
  // seb_browser_key: string
  // seb_config_key: string
  seb_quit_url: string
  allowed_languages: LangData[] // 👈 Correct type
}

const ExamFeedback: React.FC<ExamFeedbackProps> = ({ id }) => {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    short_name: '',
    is_published: true,
    start_time: '',
    duration: '',
    end_time: '',
    is_seb_restricted: false,
    seb_quit_url: '',
    allowed_languages: []
  })

  const fetchData = async () => {
    try {
      // console.log(id)

      const data = await fetchWithAuth(`/api/exam/${id}`, undefined, 'GET')

      // console.log('ini data: ', data)

      if (data.status && data.data) {
        const result = data.data

        setFormData({
          id: result.id,
          name: result.name,
          short_name: result.short_name,
          is_published: result.is_published,
          start_time: result.start_time,
          duration: result.duration,
          end_time: result.end_time,
          is_seb_restricted: result.is_seb_restricted,
          seb_quit_url: result.seb_quit_url,
          allowed_languages: result.allowed_languages
        })
      } else {
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
            Exam Finished
          </Typography>
        </Box>
        {formData.seb_quit_url === '' && formData.is_seb_restricted ? (
          <>
            <Link href={`/user/exam/${id}`}>
              <Button variant='outlined' size='small' color='primary'>
                Finish Exam
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href={formData.seb_quit_url}>
              <Button variant='outlined' size='small' color='primary'>
                Quit Exam Session
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ExamFeedback
