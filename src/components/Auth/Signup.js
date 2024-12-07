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
    <div>
      <h1>Înregistrează-te</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Parolă</label>
          <input
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmă Parola</label>
          <input
            type="password"
            placeholder="Confirmă Parola"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Înregistrează-te</button>
      </form>

      {/* Buton pentru navigare către pagina de Login */}
      <p>
        Ai deja un cont?{' '}
        <button onClick={() => navigate('/login')}>Conectează-te aici</button>
      </p>
    </div>
  );
};

export default Signup;
