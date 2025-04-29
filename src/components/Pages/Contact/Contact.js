import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';
const userID = process.env.REACT_APP_EMAILJS_USER_ID;
const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        serviceID,
        templateID,
        formData,
        userID
      )
      .then(
        (result) => {
          console.log('Email sent successfully:', result.text);
          alert('Email sent successfully!');
        },
        (error) => {
          console.log('Error sending email:', error.text);
          alert('There was an error sending the email.');
        }
      );
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <div className="contact-header">
          <h2 className="contact-title">
            <i className="bi bi-envelope-paper"></i>
            Contact us!
          </h2>
          <p className="contact-subtitle">Do you have any questions for us? Write us here!</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ex: John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ex: name@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your question</label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell us what you need..."
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
            />
          </div>

          <button type="submit" className="submit-btn">
            Send message
            <i className="bi bi-send-arrow"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;