import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeImage from '../HomeCars.png';

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/create-appointment');
  };

  return (
    <div className="container mt-5">
      <header className="text-center mb-5">
        <h1 className="display-4">Welcome to Our Service</h1>
        <p className="lead">We offer the best services for your vehicle. Our experienced mechanics are ready to assist you with any issues you might have.</p>
        <p>Explore our services and schedule an appointment now!</p>
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
            <h2>Premium Car Service</h2>
            <p>Book an appointment today for top-quality vehicle maintenance.</p>
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
        <button onClick={handleButtonClick} className="btn btn-primary btn-lg shadow">
          Schedule an Appointment
        </button>
      </div>

      <section className="reviews mb-5">
        <h2 className="text-center mb-4">What Our Clients Say</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow mb-4">
              <div className="card-body">
                <p className="card-text">"Excellent service! My car has never run better."</p>
                <footer className="blockquote-footer">John Doe</footer>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow mb-4">
              <div className="card-body">
                <p className="card-text">"Friendly staff and quick service."</p>
                <footer className="blockquote-footer">Jane Smith</footer>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow mb-4">
              <div className="card-body">
                <p className="card-text">"Affordable prices and top-notch quality."</p>
                <footer className="blockquote-footer">Emily Johnson</footer>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-light py-3 mt-5">
        <div className="container text-center">
          <p>&copy; 2025 Our Service. Made By Silviu. All rights reserved.</p>
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
