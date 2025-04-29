import React, { useState, useEffect } from 'react';
import './Mechanics.css';

const MechanicsCRUD = () => {
  const [mechanics, setMechanics] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    image: '',
    rating: '',
    availableSlots: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    const response = await fetch('http://localhost:5000/mechanics');
    const data = await response.json();
    setMechanics(data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/mechanics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          ...formData,
          availableSlots: formData.availableSlots.split(','),
          rating: parseFloat(formData.rating)
        }),
      });
      setFormData({
        name: '',
        specialization: '',
        image: '',
        rating: '',
        availableSlots: ''
      });
      setShowForm(false);
      fetchMechanics();
    } catch (error) {
      console.error('Error adding mechanic:', error);
    }
  };

  const handleDelete = async (id) => {
    console.log(localStorage.getItem('authToken'));
    await fetch(`http://localhost:5000/mechanics/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });
    fetchMechanics();
  };

  return (
    <div className="mechanics-crud-container">
      <div className="crud-header">
        <h2>Manage Cats</h2>
        <button 
          className="add-mechanic-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Mechanic'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mechanic-form-card">
          <div className="form-input-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input-group">
            <label>Breed</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input-group">
            <label>Image URL</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input-group">
            <label>Age</label>
            <input
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-input-group">
            <label>Available Slots (comma-separated)</label>
            <input
              type="text"
              name="availableSlots"
              value={formData.availableSlots}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="add-mechanic-btn">
            Add Cats
          </button>
        </form>
      )}

      <table className="mechanics-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Breed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mechanics.map(mechanic => (
            <tr key={mechanic.id}>
              <td>{mechanic.name}</td>
              <td>{mechanic.specialization}</td>
              <td>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(mechanic.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MechanicsCRUD;