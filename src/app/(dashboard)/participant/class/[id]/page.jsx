import ViewClassJudge from '@/views/judge/view/ClassPageJudge'
import UserTable from '@/components/Table/Judge/UserTable'
import ExamTableParticipant from '@/components/Table/Participant/ExamTable'

const FormLayouts = () => {
  return (
    <>
      <ViewClassJudge />

      <UserTable />

      <ExamTableParticipant />
    </>
  )
}

export default FormLayouts
