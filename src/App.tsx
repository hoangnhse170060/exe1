import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import History from './pages/history';
import Shop from './pages/Shop';
import Forum from './pages/Forum';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import EnhancedRegister from './pages/EnhancedRegister';
import ForgotPassword from './pages/ForgotPassword';
import Checkout from './pages/Checkout';
import PaymentResult from './pages/PaymentResult';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import ShopRequest from './pages/ShopRequest';
import ShopDashboard from './pages/ShopDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminWorkflow from './pages/AdminWorkflow';

function App() {
  return (
    <Router>
  <div className="min-h-screen bg-gradient-to-br from-brand-base via-brand-sand to-white">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-enhanced" element={<EnhancedRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop-request" element={<ShopRequest />} />
            <Route path="/shop-dashboard" element={<ShopDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-workflow/:workflowKey" element={<AdminWorkflow />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-result" element={<PaymentResult />} />
            <Route path="/order-details" element={<OrderDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
