import React, { useState, useEffect } from 'react';
import './Cats.css';

const CatsCRUD = () => {
  const [cats, setCats] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    image: '',
    rating: '',
    availableSlots: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    const response = await fetch('http://localhost:5000/cats');
    const data = await response.json();
    setCats(data);
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
      await fetch('http://localhost:5000/cats', {
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
      fetchCats();
    } catch (error) {
      console.error('Error adding cat:', error);
    }
  };

  const handleDelete = async (id) => {
    console.log(localStorage.getItem('authToken'));
    await fetch(`http://localhost:5000/cats/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });
    fetchCats();
  };

  return (
    <div className="cats-crud-container">
      <div className="crud-header">
        <h2>Manage Cats</h2>
        <button 
          className="add-cat-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Cat'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="cat-form-card">
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

          <button type="submit" className="add-cat-btn">
            Add Cats
          </button>
        </form>
      )}

      <table className="cats-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Breed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cats.map(cat => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.specialization}</td>
              <td>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(cat.id)}
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

export default CatsCRUD;