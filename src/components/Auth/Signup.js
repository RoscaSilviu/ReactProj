import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  // Stările pentru câmpurile formularului
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook pentru navigare

  // Funcția de submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificăm dacă parolele se potrivesc
    if (password !== confirmPassword) {
      setErrorMessage('Parolele nu se potrivesc!');
      return;
    }

    // Verificăm validitatea emailului
    if (!email.includes('@') || password.length < 6) {
      setErrorMessage('Email invalid sau parola prea scurtă!');
      return;
    }

    // Trimiterea datelor la server
    const response = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Înregistrare reușită! Te poți loga acum.');
      navigate('/login'); // Redirecționare automată către pagina de login
    } else {
      setErrorMessage(data.message || 'Ceva nu a mers bine. Încearcă din nou.');
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
          <button type="submit" className="btn btn-primary w-100">Înregistrează-te</button>
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
