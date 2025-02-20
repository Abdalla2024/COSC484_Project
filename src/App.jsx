import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Messages from './pages/Messages'
import Sell from './pages/Sell'
import Listing from './pages/Listing'
import './App.css'

function App() {
  const location = useLocation();
  const showNavbar = !['signin', 'signup'].includes(location.pathname.slice(1));

  return (
    <div className="min-h-screen bg-white">
      {showNavbar && <Navbar />}
      <div className="w-full overflow-x-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/listing/:id" element={<Listing />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
