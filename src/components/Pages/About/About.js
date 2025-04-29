import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [index, setIndex] = useState(0);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await fetch('http://localhost:5000/mechanics');
        if (!response.ok) throw new Error('Failed to fetch mechanics');
        const data = await response.json();
        setMechanics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMechanics();
  }, []);

  const handlePrevClick = () => {
    setIndex(prev => (prev === 0 ? mechanics.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setIndex(prev => (prev === mechanics.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (mechanics.length === 0) return <div className="no-mechanics">No cats available</div>;

  const currentMechanic = mechanics[index];

  return (
    <div className="about-container">
      <div className="header-section">
        <h1 className="about-title">Our Lovely Cats</h1>
        <p className="about-subtitle">Meet our lovely feline friends ready to be adopted into their fur-ever home!</p>
      </div>

      <div className="mechanic-slider">
        <div className="slider-wrapper">
          <div className="mechanic-card" key={currentMechanic.id}>
            <div className="image-container">
              <img 
                src="{currentMechanic.imageUrl}"
                alt={currentMechanic.name} 
                className="mechanic-image"
                onError={(e) => {
                  e.target.src = '/default-mechanic.jpg'; // Fallback image
                }}
              />
              <div className="rating-badge">
                ⭐ {currentMechanic.rating}/5
              </div>
            </div>
            
            <div className="mechanic-info">
              <h3 className="mechanic-name">{currentMechanic.name}</h3>
              <p className="specialization">
                <strong>Breed:</strong> {currentMechanic.specialization}
              </p>
              
              <div className="availability-section">
                <h4>Available Slots:</h4>
                <div className="time-slots">
                  {currentMechanic.availableSlots.map((slot, i) => (
                    <span key={i} className="time-slot">{slot}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="slider-controls">
          <button 
            className="nav-button prev" 
            onClick={handlePrevClick}
            aria-label="Previous mechanic"
          >
            ‹
          </button>
          <div className="pagination">
            {mechanics.map((_, i) => (
              <span 
                key={i}
                className={`dot ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <button 
            className="nav-button next" 
            onClick={handleNextClick}
            aria-label="Next mechanic"
          >
            ›
          </button>
        </div>
      </div>

      <div className="about-description">
        <h2>Why Choose Us?</h2>
        <p>
          Our passionate, cat-loving team combines years of hands-on experience with a deep commitment to feline care. 
          From playful kittens to wise old whiskers, we provide a safe, loving environment for every cat. 
          Whether it's cuddles, care, or finding their forever home, we're here to help each cat thrive.
        </p>
      </div>
    </div>
  );
};

export default About;