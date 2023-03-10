import { useState } from 'react'
import {
  Box,
  Modal,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
} from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

const ModalComp = ({ open, handleClose }) => {
  // State variables
  const [degreeColumn, setDegreeColumn] = useState('')
  const [studentTable, setStudentTable] = useState('')

  // Values for degree column
  const degreeColumnValues = [
    'id',
    'student_name',
    'father_name',
    'registration_no',
    'roll_no',
    'serial_no',
    'degree_title',
  ]

  // Values for student table
  const studentTables = ['Degree', 'Semesters', 'Course']

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Grid container direction='row' gap={4} justifyContent='center'>
          {/* Degree Column */}
          <Grid item>
            <FormControl variant='standard' sx={{ minWidth: 185 }}>
              <InputLabel id='degree-column'>Select Degree Column</InputLabel>
              <Select
                labelId='degree-column'
                id='degree-column-select'
                value={degreeColumn}
                onChange={(e) => setDegreeColumn(e.target.value)}
                label='Degree Column'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {degreeColumnValues.map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Student Table */}
          <Grid item>
            <FormControl variant='standard' sx={{ minWidth: 115 }}>
              <InputLabel id='student-table'>Select Table</InputLabel>
              <Select
                labelId='student-table'
                id='student-table-select'
                value={studentTable}
                onChange={(e) => setStudentTable(e.target.value)}
                label='Student Table'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {studentTables.map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Select TODO: Pending*/}
          <Grid item>
            <FormControl variant='standard' sx={{ minWidth: 115 }}>
              <InputLabel id='student-table'>Select Value</InputLabel>
              <Select
                labelId='student-table'
                id='student-table-select'
                value={studentTable}
                onChange={(e) => setStudentTable(e.target.value)}
                label='Student Table'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {studentTables.map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Modal Actions */}
          <Grid
            item
            container
            direction='row'
            justifyContent='flex-end'
            gap={4}
          >
            <Grid item>
              <Button
                sx={{ textTransform: 'capitalize' }}
                disableElevation
                onClick={handleClose}
                variant='contained'
              >
                Submit
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{ textTransform: 'capitalize' }}
                disableElevation
                onClick={handleClose}
                variant='contained'
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ModalComp
