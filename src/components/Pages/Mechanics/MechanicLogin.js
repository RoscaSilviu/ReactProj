import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MechanicLogin = () => {
  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useAuth();
  const [rememberMe, setRememberMe] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    sessionStorage.removeItem('authToken');

    if (name.length < 3 || password.length < 3) {
      alert('Numele de utilizator sau parola este prea scurtă!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/mechanics/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);

        // Storage handling
        if (rememberMe) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('rememberedUsername', name);
        } else {
          localStorage.setItem('authToken', data.token);
          localStorage.removeItem('rememberedUsername');
        }

        console.log(data.token);

        localStorage.setItem('mechanicId', data.mechanic.id);
        console.log(data.mechanic.id);
        navigate(location.state?.from || '/MechanitcAppoinments');
      } else {
        alert('Nume de utilizator sau parolă incorectă!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Autentificarea a eșuat. Încearcă din nou.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nume Mecanic</label>
              <input
                type="text"
                id="name"
                placeholder="Nume utilizator"
                value={name}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Parola</label>
              <input
                type="password"
                id="password"
                placeholder="Parola"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MechanicLogin;
