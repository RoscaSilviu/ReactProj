import React, { useState } from 'react';
import emailjs from 'emailjs-com';

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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3 className="text-center mb-4">Contactează-ne</h3>
          <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Numele</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Introduceti numele"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Introduceti emailul"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Mesaj</label>
              <textarea
                id="message"
                name="message"
                placeholder="Scrie mesajul tau"
                value={formData.message}
                onChange={handleChange}
                required
                className="form-control"
                rows="4"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Trimite</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
