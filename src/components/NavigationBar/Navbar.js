import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberedEmail');
    setIsAuthenticated(false);
    alert('Te-ai deconectat cu succes!');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/home" className="navbar-brand">Meowkanic</NavLink>
        <div className={`navbar-menu ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink 
              to="/home" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              Contact
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/manage-appointments" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              Appointments
            </NavLink>
          </li>
            <li className="nav-item">
              <button className="sign-out-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;