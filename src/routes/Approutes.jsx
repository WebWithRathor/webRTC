import React from 'react'
import { Route, Routes } from 'react-router-dom'
import App from '../App'
import Streaming from '../components/Streaing'

const Approutes = () => {
  return (
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/stream" element={<Streaming />} />
    </Routes>
  )
}

export default Approutes