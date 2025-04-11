// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Component Imports
import EditClassForm from '@/views/class/edit/EditClassForm'
import ClassTopSection from '@/views/class/ClassTopSection'
import EditUserClass from '@/views/class/edit/EditUserClass'
import ViewClass from '@/views/class/view/ViewClass'
import ExamTable from '@/components/Table/Judge/ExamTable'
import ViewClassJudge from '@/views/judge/view/ClassPageJudge'
import UserTable from '@/components/Table/Judge/UserTable'
import ViewProblemJudge from '@/views/judge/view/ProblemPageJudge'
import ProblemTable from '@/components/Table/Judge/ProblemTable'
import TestCaseTable from '@/components/Table/Judge/TestCaseTable'

const FormLayouts = () => {
  return (
    <>
      <ViewProblemJudge />

      <TestCaseTable />
    </>
  )
}

export default FormLayouts
