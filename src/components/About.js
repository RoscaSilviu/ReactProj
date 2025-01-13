// src/pages/About.js
import React, { useState } from 'react';
import './About.css'; // Importăm fișierul CSS pentru stiluri

const About = () => {
  const [index, setIndex] = useState(0);

  const mechanics = [
    { id: 1, name: 'Ion Popescu', specialization: 'Motor și Transmisie', image: 'url(./HomeCars.png)', rating: 4.8 },
    { id: 2, name: 'Maria Ionescu', specialization: 'Sisteme Electrice', image: 'https://via.placeholder.com/150', rating: 4.9 },
    { id: 3, name: 'Vasile Dănuț', specialization: 'Caroserie și vopsitorie', image: 'https://via.placeholder.com/150', rating: 4.7 },
    { id: 4, name: 'Gabriela Stanciu', specialization: 'Diagnosticare auto', image: 'https://via.placeholder.com/150', rating: 5.0 },
  ];

  const handlePrevClick = () => {
    setIndex(index === 0 ? mechanics.length - 1 : index - 1);
  };

  const handleNextClick = () => {
    setIndex(index === mechanics.length - 1 ? 0 : index + 1);
  };

  return (
    <div className="container mt-5">
      <h1>About Us</h1>
      <p>Meet our team of expert mechanics. Scroll through to see their specialties and ratings.</p>

      <div className="mechanic-slider">
        <div className="mechanic-card">
          <img src={mechanics[index].image} alt={mechanics[index].name} className="mechanic-img" />
          <h4>{mechanics[index].name}</h4>
          <p><strong>Specialization:</strong> {mechanics[index].specialization}</p>
          <p><strong>Rating:</strong> {mechanics[index].rating} ⭐</p>
        </div>

        <div className="slider-controls">
          <button className="prev-btn" onClick={handlePrevClick}>←</button>
          <button className="next-btn" onClick={handleNextClick}>→</button>
        </div>
      </div>
    </div>
  );
};

export default About;
