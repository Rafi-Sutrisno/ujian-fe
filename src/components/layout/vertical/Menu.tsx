'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { getRoleFromToken, getTokenFromCookies } from '@/utils/token'
import { MenuItem, MenuSection } from '@menu/vertical-menu'

const MenuAuthRole = () => {
  const [role, setRole] = useState<'user' | 'admin' | null>(null)

  useEffect(() => {
    const token = getTokenFromCookies()
    const userRole = getRoleFromToken(token)
    setRole(userRole)
  }, [])

  return (
    <>
      {role === 'admin' && (
        <MenuSection label='Admin'>
          <MenuItem
            href='/admin/user'
            icon={<i className='ri-group-line' />}
            activeUrl='/admin/user'
            exactMatch={false} // allows `/admin/user`, `/admin/user/123`, etc.
          >
            User
          </MenuItem>

          <MenuItem
            href='/admin/class'
            icon={<i className='ri-graduation-cap-line' />}
            activeUrl='/admin/class'
            exactMatch={false} // only highlights on `/admin/class`
          >
            Class
          </MenuItem>

          <MenuItem
            href='/admin/exam'
            icon={<i className='ri-file-paper-2-line' />}
            activeUrl='/admin/exam'
            exactMatch={false}
          >
            Exam
          </MenuItem>

          <MenuItem
            href='/admin/problem'
            icon={<i className='ri-file-list-3-line' />}
            activeUrl='/admin/problem'
            exactMatch={false}
          >
            Problem
          </MenuItem>
        </MenuSection>
      )}

      {role === 'user' && (
        <MenuSection label='User'>
          <MenuItem
            href='/user/class'
            icon={<i className='ri-graduation-cap-line' />}
            activeUrl='/user/class'
            exactMatch={false}
          >
            Class
          </MenuItem>

          <MenuItem
            href='/user/exam'
            icon={<i className='ri-file-list-3-line' />}
            activeUrl='/user/exam'
            exactMatch={false}
          >
            Exam
          </MenuItem>
        </MenuSection>
      )}
    </>
  )
}

export default MenuAuthRole
