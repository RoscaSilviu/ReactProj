import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Auth/Login/Login';
import Signup from './components/Auth/Signup';
import Appointment from './components/appointment-system';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppointmentManagement from './components/User-appointments';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};


const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <NavbarWrapper />
          <AutoLogin />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }/>
            <Route path="/about" element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }/>
            <Route path="/contact" element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }/>
            <Route path="/create-appointment" element={
              <ProtectedRoute>
                <Appointment />
              </ProtectedRoute>
            }/>
            <Route path="/manage-appointments" element={
              <ProtectedRoute>
                <AppointmentManagement />
              </ProtectedRoute>
            }/>
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

// Componentă pentru redirecționare automată
const AutoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/home'); // Redirecționează doar dacă utilizatorul este pe login/signup
    }
  }, [navigate, location]);

  return null;
};

// Wrapper pentru afișarea condiționată a Navbar
const NavbarWrapper = () => {
  //const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Navbarul nu va fi afișat pe rutele /login și /signup
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return <Navbar />;
};

export default App;
