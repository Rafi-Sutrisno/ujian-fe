// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Component Imports
import EditClassForm from '@/views/class/edit/EditClassForm'
import ClassTopSection from '@/views/class/ClassTopSection'
import EditUserClass from '@/views/class/edit/EditUserClass'

const FormLayouts = () => {
  return (
    <>
      <EditClassForm />

      <EditUserClass />
    </>
  )
}

export default FormLayouts
