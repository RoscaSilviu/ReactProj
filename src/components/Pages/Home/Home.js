import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeImage from '../../../bg.png';

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/create-appointment');
  };

  return (
    <div className="container mt-5">
      <header className="text-center mb-5">
        <h1 className="display-4">Welcome to Fur-ever Home</h1>
        <p className="lead">We're dedicated to giving every cat a second chance at love. Our caring team is here to match each whiskered friend with their perfect forever family.</p>
        <p>Meet our adorable residents and find your new furry companion today!</p>
      </header>

      {/* Image container with text overlay */}
      <div className="text-center mb-5 position-relative">
        <div
          style={{
            backgroundImage: `url(${HomeImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '500px',
            borderRadius: '0.25rem',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}
          className="img-fluid rounded shadow"
        >
          {/* Text overlay */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent background
              padding: '20px',
              borderRadius: '5px',
              textAlign: 'center',
              width: '80%',
            }}
          >
            <h2>Adopt a Feline Friend</h2>
            <p>Start your journey today and give a loving cat the forever home they deserve.</p>
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
        <button onClick={handleButtonClick} className="btn btn-primary btn-lg shadow">
          Adopt a cat
        </button>
      </div>

      <section className="reviews mb-5">
        <h2 className="text-center mb-4">What Our Adopters Say</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow mb-4">
              <div className="card-body">
                <p className="card-text">"Adopting from Fur-ever Home was the best decision! Our new kitty fits right into the family."</p>
                <footer className="blockquote-footer">Alexandra</footer>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow mb-4">
              <div className="card-body">
                <p className="card-text">"The staff were so kind and helpful, they truly care about every cat."</p>
                <footer className="blockquote-footer">Stefi</footer>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow mb-4">
              <div className="card-body">
                <p className="card-text">"We found our perfect match thanks to Fur-ever Home. Highly recommend to anyone looking to adopt!"</p>
                <footer className="blockquote-footer">Ioana</footer>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-light py-3 mt-5">
        <div className="container-fluid text-center">
          <p>&copy; 2025 Our Service. Made By Silviu, Stefi & Alexandra. All rights reserved.</p>
          <ul className="list-inline">
            <li className="list-inline-item">Privacy Policy</li>
            <li className="list-inline-item">Terms of Service</li>
            <li className="list-inline-item">Contact Us</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Home;
