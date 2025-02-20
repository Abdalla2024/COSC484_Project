import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
