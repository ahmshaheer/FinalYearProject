import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomePage from './pages/HomePage'
import DegreePage from './pages/DegreePage'
import TranscriptPage from './pages/TranscriptPage'
import NavigationPage from './pages/NavigationPage'
import CnicPage from './pages/CnicPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<NavigationPage />} >
          <Route index element={<HomePage />} />
          <Route path='/degree-page' element={<DegreePage />} />
          <Route path='/transcript-page' element={<TranscriptPage />} />
          <Route path='/cnic-page' element={<CnicPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
