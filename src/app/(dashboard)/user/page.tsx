// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import UserTableAdmin from '@/views/user/UserTableAdmin'
import TopSection from '@/components/top-section/topsection'

const FormLayouts = () => {
  return (
    <>
      <TopSection title='User Management' buttonText='Add New User' buttonLink='/user/create' />
      <UserTableAdmin />
    </>
  )
}

export default FormLayouts
