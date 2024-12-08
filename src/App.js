import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Services from './components/Services';
import Login from './components/Auth/Login/Login';
import Signup from './components/Auth/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="155818115709-uamss5h76ek61hb15je749s6brs1deui.apps.googleusercontent.com"> {/* Înlocuiește cu Client ID-ul tău */}
      <AuthProvider>
        <Router>
          <NavbarWrapper />
          <AutoLogin />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
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
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Navbarul nu va fi afișat pe rutele /login și /signup
  if (!isAuthenticated || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return <Navbar />;
};

export default App;
