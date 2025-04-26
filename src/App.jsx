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
import MyListings from './pages/MyListings'
import AccountSettings from './pages/AccountSettings'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Dispute from './pages/Dispute'
import Reviews from './pages/Reviews'
import OrderConfirmation from './pages/OrderConfirmation'
import './App.css'

function App() {
  const location = useLocation();
  const isAuthPage = ['signin', 'signup'].includes(location.pathname.slice(1));

  if (isAuthPage) {
    return (
      <div className="w-screen h-screen overflow-hidden">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar />
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/checkout/:listingId" element={<Checkout />} />
          <Route path="/my-orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<Orders />} />
          <Route path="/disputes/:orderId" element={<Dispute />} />
          <Route path="/reviews/:sellerId" element={<Reviews />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
