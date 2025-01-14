import React, { useState } from 'react';
import './About.css';
import car2 from '../car2.jpg'; 
import car4 from '../car4.jpg';
import car5 from '../car5.jpg';
import car6 from '../car6.PNG';

const About = () => {
  const [index, setIndex] = useState(0);

  const mechanics = [
    { id: 1, name: 'Ion Popescu', specialization: 'Motor și Transmisie', image: car2, rating: 4.8 },
    { id: 2, name: 'Maria Ionescu', specialization: 'Sisteme Electrice', image: car4, rating: 4.9 },
    { id: 3, name: 'Vasile Dănuț', specialization: 'Caroserie ', image: car5, rating: 4.7 },
    { id: 4, name: 'Gabriel Stanciu', specialization: 'Diagnosticare auto', image: car6, rating: 5.0 },
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
      <p>Meet our team of expert meowkanichs. Scroll through to see their specialties and ratings.</p>

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
