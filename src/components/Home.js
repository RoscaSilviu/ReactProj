// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importă useNavigate pentru navigare

const Home = () => {
  const navigate = useNavigate(); // Hook-ul pentru navigare

  const handleButtonClick = () => {
    navigate('/appointments'); // Navighează la pagina de appointments
  };

  return (
    <div className="container mt-5">
      <h1>Welcome to Our Service</h1>
      <p>We offer the best services for your vehicle. Our experienced mechanics are ready to assist you with any issues you might have.</p>
      <p>Explore our services and schedule an appointment now!</p>
      
      {/* Imagine mare */}
      <div className="text-center my-5">
        <img
          src="https://via.placeholder.com/1200x500" // Poți înlocui cu imaginea dorită
          alt="Car service"
          className="img-fluid"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* Buton pentru navigare */}
      <div className="text-center">
        <button onClick={handleButtonClick} className="btn btn-primary btn-lg">
          Schedule an Appointment
        </button>
      </div>
    </div>
  );
};

export default Home;
