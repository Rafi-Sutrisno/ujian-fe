// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

const DashboardAnalytics = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant='h4' fontWeight='bold' gutterBottom>
            Platform Ujian Pemrograman
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Selamat datang di platform ujian pemrgoraman.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
