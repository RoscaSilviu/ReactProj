import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberedEmail');
    alert('Te-ai deconectat cu succes!');
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li>
          {/* Buton pentru Sign Out */}
          <button onClick={handleSignOut}>
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
