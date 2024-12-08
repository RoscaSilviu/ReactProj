import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useAuth();
  const [rememberMe, setRememberMe] = useState(false); // Starea pentru "Remember Me"
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedToken = localStorage.getItem('authToken');

    if (location.pathname === '/login' && savedEmail && savedToken) {
      navigate('/home');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || password.length < 6) {
      alert('Email invalid sau parolă prea scurtă!');
      return;
    }

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      const data = await response.json();
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('authToken', data.token);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      navigate('/home');
    } else {
      alert('Email sau parolă incorectă!');
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google Login Succes:', decoded);

      // Poți salva token-ul și email-ul în localStorage
      localStorage.setItem('googleAuthToken', credentialResponse.credential);
      localStorage.setItem('rememberedEmail', decoded.email); // Email-ul utilizatorului
      setIsAuthenticated(true);

      // Redirecționăm utilizatorul
      navigate('/home');
    } catch (error) {
      console.error('Eroare la decodarea token-ului JWT:', error);
      alert('Eroare la autentificarea cu Google.');
    }
  };

  const handleGoogleLoginFailure = () => {
    alert('Eroare la autentificarea cu Google. Încearcă din nou!');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Nu ai un cont? <button onClick={() => navigate('/signup')}>Înregistrează-te aici</button>
      </p>

      {/* Butonul Google Login */}
      <div>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
        />
      </div>
    </div>
  );
};

export default Login;
