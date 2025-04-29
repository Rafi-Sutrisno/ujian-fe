// components/Breadcrumbs.tsx
'use client'

import React from 'react'
import Link from 'next/link'

import Breadcrumbs from '@mui/material/Breadcrumbs'

import Typography from '@mui/material/Typography'
import { usePathname } from 'next/navigation'

const CustomBreadcrumbs = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const createBreadcrumbs = () => {
    return pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/')
      const isLast = index === pathSegments.length - 1
      const label = segment.charAt(0).toUpperCase() + segment.slice(1)

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

export default CustomBreadcrumbs
