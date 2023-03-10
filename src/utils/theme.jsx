import { createTheme } from '@mui/material'
import { red, blue, grey, cyan, green } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: blue.A400,
    },
    secondary: {
      main: cyan.A400,
    },
    error: {
      main: red.A400,
    },
    success: {
      main: green.A400,
    },
    logo: {
      main: grey.A100,
    },
  },
})

export default theme
