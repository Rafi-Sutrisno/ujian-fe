'use client'
import { getRoleFromToken, getTokenFromCookies } from '@/utils/token'
import { SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import { useEffect, useState } from 'react'
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
          <MenuItem href='/admin/user' icon={<i className='ri-group-line' />}>
            User
          </MenuItem>
          <MenuItem href='/admin/class' icon={<i className='ri-graduation-cap-line' />}>
            Class
          </MenuItem>
          <MenuItem href='/admin/exam' icon={<i className='ri-file-paper-2-line' />}>
            Exam
          </MenuItem>
          <MenuItem href='/admin/problem' icon={<i className='ri-file-list-3-line' />}>
            Problem
          </MenuItem>
        </MenuSection>
        // <SubMenu label='Admin' icon={<i className='ri-home-smile-line' />}>
        //   <MenuItem href='/'>Home</MenuItem>
        //   <MenuItem href='/admin/user'>User</MenuItem>
        //   <MenuItem href='/admin/class'>Class</MenuItem>
        //   <MenuItem href='/admin/problem'>Problem</MenuItem>
        // </SubMenu>
      )}

      {role === 'user' && (
        <MenuSection label='User'>
          <MenuItem href='/home' icon={<i className='ri-home-5-line' />}>
            Home
          </MenuItem>
          <MenuItem href='/student/class' icon={<i className='ri-graduation-cap-line' />}>
            Class
          </MenuItem>
          <MenuItem href='/student/exam' icon={<i className='ri-file-list-3-line' />}>
            Exam
          </MenuItem>
        </MenuSection>
      )}
    </>
  )
}

export default MenuAuthRole
