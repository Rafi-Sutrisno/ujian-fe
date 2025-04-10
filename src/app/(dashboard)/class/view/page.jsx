// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Component Imports
import EditClassForm from '@/views/class/edit/EditClassForm'
import ClassTopSection from '@/views/class/ClassTopSection'
import EditUserClass from '@/views/class/edit/EditUserClass'
import ViewClass from '@/views/class/view/ViewClass'
import UserListTable from '@/views/class/view/UserListTable'

const FormLayouts = () => {
  return (
    <>
      <ViewClass />

      <UserListTable />
    </>
  )
}

export default FormLayouts
