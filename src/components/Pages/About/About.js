import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [index, setIndex] = useState(0);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('http://localhost:5000/cats');
        if (!response.ok) throw new Error('Failed to fetch cats');
        const data = await response.json();
        setCats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const handlePrevClick = () => {
    setIndex(prev => (prev === 0 ? cats.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setIndex(prev => (prev === cats.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (cats.length === 0) return <div className="no-cats">No cats available</div>;

  const currentCat = cats[index];

  return (
    <div className="about-container">
      <div className="header-section">
        <h1 className="about-title">Our Lovely Cats</h1>
        <p className="about-subtitle">Meet our lovely feline friends ready to be adopted into their fur-ever home!</p>
      </div>

      <div className="cat-slider">
        <div className="slider-wrapper">
          <div className="cat-card" key={currentCat.id}>
            <div className="image-container">
              <img 
                src={currentCat.image}
                alt={currentCat.name} 
                className="cat-image"
                onError={(e) => {
                  e.target.src = '/default-cat.jpg'; // Fallback image
                }}
              />
            </div>
            
            <div className="cat-info">
              <h3 className="cat-name">{currentCat.name}</h3>
              <p className="specialization">
                <strong>Breed:</strong> {currentCat.specialization}
                <strong>Age:</strong> {currentCat.rating}

              </p>
              
              <div className="availability-section">
                <h4>Available Slots:</h4>
                <div className="time-slots">
                  {currentCat.availableSlots.map((slot, i) => (
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
            aria-label="Previous cat"
          >
            ‹
          </button>
          <div className="pagination">
            {cats.map((_, i) => (
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
            aria-label="Next cat"
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