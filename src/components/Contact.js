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

    // Configurare pentru trimiterea emailului
    emailjs
      .send(
        serviceID, // ID-ul serviciului
        templateID, // ID-ul template-ului
        formData,           // Datele formularului
        userID      // ID-ul utilizatorului
      )
      .then(
        (result) => {
          console.log('Email trimis cu succes:', result.text);
          alert('Email trimis cu succes!');
        },
        (error) => {
          console.log('Eroare la trimiterea emailului:', error.text);
          alert('A apărut o eroare la trimiterea emailului.');
        }
      );
  };

  return (
    <div>
      <h3>Contactează-ne</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Numel:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mesaj:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Trimite</button>
      </form>
    </div>
  );
};

export default Contact;
