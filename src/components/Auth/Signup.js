import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validări
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Email invalid!');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Parola trebuie să aibă minim 8 caractere!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Parolele nu se potrivesc!');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Eroare la înregistrare');
      }

      alert('Înregistrare reușită! Te poți loga acum.');
      navigate('/login');
    } catch (error) {
      setErrorMessage(
        error.message === 'Email already exists' 
          ? 'Acest email este deja înregistrat!' 
          : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h1 className="text-center mb-4">Înregistrează-te</h1>
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Parolă</label>
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
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmă Parola</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirmă Parola"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button 
        type="submit" 
        className="btn btn-primary w-100"
        disabled={isLoading}
      >
        {isLoading ? 'Se înregistrează...' : 'Înregistrează-te'}
      </button>
        </form>
        <p className="text-center mt-3">
          Ai deja un cont?{' '}
          <button
            onClick={() => navigate('/login')}
            className="btn btn-link text-decoration-none"
          >
            Conectează-te aici
          </button>
        </p>
      </div>
    </div>
  </div>
  
  );
};

export default Signup;
