import React, { useState,useEffect  } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate,useLocation } from 'react-router-dom';

const Login = () => {
  // Declarăm starea în interiorul componentei
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
  }, [location,navigate]);

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
    <p>Nu ai un cont? <button onClick={() => navigate('/signup')}>Înregistrează-te aici</button></p>
    </div>
   
  );
};

export default Login;
