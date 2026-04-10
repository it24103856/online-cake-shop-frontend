import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import LinkPage from './pages/linkPage';
import AdminPage from './pages/adminPage';
import DriverDashboard from './pages/DriverDashboard';

import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <GoogleOAuthProvider clientId="601712598116-ckm9o17glc4rkas75394cfdcp74glbig.apps.googleusercontent.com">
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <div className='w-full min-h-screen bg-[#F3F4F6] text-[#1F1F1F]'>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            
            {/* Admin Route should come first */}
            <Route path="/admin/*" element={<AdminPage />} />
            
            {/* All other routes (Home, About, Contact) go to LinkPage */}       
            <Route path="/*" element={<LinkPage />} />
            
            
               </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;