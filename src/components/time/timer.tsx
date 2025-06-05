'use client'
import { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'

export default function Timer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const end = new Date(endTime).getTime()

    const interval = setInterval(() => {
      const now = Date.now()
      const diff = Math.max(0, Math.floor((end - now) / 1000)) // in seconds

      setTimeLeft(diff)

      if (diff <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval) // Cleanup on unmount
  }, [endTime])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <Grid item>
      <Typography variant='h3' fontWeight='bold'>
        {formatTime(timeLeft)}
      </Typography>
    </Grid>
  )
}
