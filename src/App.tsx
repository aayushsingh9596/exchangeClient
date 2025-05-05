import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Markets from './pages/Markets'
import Market from './pages/Market'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Markets />} />
        <Route path='/trade/:symbol' element={<Market />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
