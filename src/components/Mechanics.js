import React, { useState, useEffect } from 'react';

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
    await fetch(`http://localhost:5000/mechanics/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    });
    fetchMechanics();
  };

  return (
    <div className="container mt-5">
      <h2>Manage Mechanics</h2>
      
      <button 
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Add New Mechanic'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-3 mb-4">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              className="form-control"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              className="form-control"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <input
              type="number"
              className="form-control"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Available Slots (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              name="availableSlots"
              value={formData.availableSlots}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success">
            Add Mechanic
          </button>
        </form>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mechanics.map(mechanic => (
            <tr key={mechanic.id}>
              <td>{mechanic.name}</td>
              <td>{mechanic.specialization}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(mechanic.id)}>
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