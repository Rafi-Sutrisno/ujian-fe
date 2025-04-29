'use client'

import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import { usePathname } from 'next/navigation'

const AdminBreadcrumbs = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const userDisplayName = 'Rafi Sutrisno'

  const createBreadcrumbs = () => {
    const excludedSegments = ['admin', 'judge']
    const filteredSegments = pathSegments.filter(segment => !excludedSegments.includes(segment))

    return filteredSegments.map((segment, index) => {
      const originalIndex = pathSegments.findIndex(
        (seg, i) =>
          !excludedSegments.includes(seg) && pathSegments.slice(i).join('/') === filteredSegments.slice(index).join('/')
      )

      const path = '/' + pathSegments.slice(0, originalIndex + 1).join('/')
      const isLast = index === filteredSegments.length - 1

      const isUserDetail = filteredSegments.length >= 2 && filteredSegments[0] === 'user' && index === 1
      const label = isUserDetail ? userDisplayName : segment.charAt(0).toUpperCase() + segment.slice(1)

      return isLast ? (
        <Typography key={path} color='text.primary'>
          {label}
        </Typography>
      ) : (
        <Link key={path} href={path} passHref>
          <Typography color='primary'>{label}</Typography>
        </Link>
      )
    })
  }

  return (
    <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
      <Link href='/' passHref>
        <Typography color='primary'>Home</Typography>
      </Link>
      {createBreadcrumbs()}
    </Breadcrumbs>
  )
}

export default AdminBreadcrumbs
