import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../../context/AuthContext';
import { PencilSquare, Trash, ClockHistory, PersonGear } from 'react-bootstrap-icons';
import './miau.css';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editForm, setEditForm] = useState({
    carBrand: '',
    carModel: '',
    year: '',
    description: ''
  });
  const { setIsAuthenticated } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/appointments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch appointments');

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Error loading appointments');
    } finally {
      setIsLoading(false);
    }
  }, [setIsAuthenticated]);


  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleEditInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const openEditDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setEditForm({
      carBrand: appointment.carBrand,
      carModel: appointment.carModel,
      year: appointment.year.toString(),
      description: appointment.description
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/appointments/${selectedAppointment.id}`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            ...editForm,
            year: parseInt(editForm.year, 10)
          })
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) throw new Error('Update failed');

      const updatedAppointment = await response.json();
      setAppointments(prev => prev.map(a => 
        a.id === selectedAppointment.id ? updatedAppointment : a
      ));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating appointment');
    }
  };

  // Delete appointment
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/appointments/${selectedAppointment.id}`, 
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) throw new Error('Delete failed');

      setAppointments(prev => 
        prev.filter(a => a.id !== selectedAppointment.id)
      );
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting appointment');
    }
  };

  if (isLoading) {
    return (
      <div className="management-container">
        <div className="loading-overlay">
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && appointments.length === 0) {
    return (
      <div className="management-container">
        <div className="empty-state">
          <ClockHistory size={48} className="empty-icon" />
          <h4 className="empty-title">No appointments</h4>
          <p className="empty-subtitle">For now, there are no appointments in our system</p>
        </div>
      </div>
    );
  }
  return (
    <div className="management-container">
      <div className="management-card">
        <div className="card-header-primary">
          <h3 className="management-title">
            <PersonGear className="header-icon" />
            Your Appointments
          </h3>
        </div>
        
        <div className="card-body">
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-content">
                  <div className="vehicle-info">
                    <span className="vehicle-badge">
                      {appointment.carBrand} {appointment.carModel}
                    </span>
                    <span className="year-badge">{appointment.year}</span>
                  </div>
                  
                  <div className="appointment-details">
                    <div className="detail-item">
                      <span className="detail-label">Cat:</span>
                      <span className="detail-value">{appointment.mechanic}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {new Date(appointment.date).toLocaleDateString('ro-RO')} 
                        <span className="time-badge">{appointment.time}</span>
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Description:</span>
                      <p className="detail-description">{appointment.description}</p>
                    </div>
                  </div>
                </div>

                <div className="appointment-actions">
                  <button 
                    className="btn btn-icon-edit"
                    onClick={() => openEditDialog(appointment)}
                  >
                    <PencilSquare size={20} />
                  </button>
                  <button 
                    className="btn btn-icon-delete"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditDialogOpen && (
        <div className="management-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                <PencilSquare className="modal-icon" />
                Edit Appointment
              </h4>
              <button 
                type="button" 
                className="btn-close-modal"
                onClick={() => setIsEditDialogOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    className="form-control"
                    name="carBrand"
                    value={editForm.carBrand}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    className="form-control"
                    name="carModel"
                    value={editForm.carModel}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    className="form-control"
                    name="year"
                    type="number"
                    value={editForm.year}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group-full">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditInputChange}
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteDialogOpen && (
        <div className="management-modal">
          <div className="modal-content modal-content-warning">
            <div className="modal-header">
              <h4 className="modal-title">
                <Trash className="modal-icon" />
                Confirm delete
              </h4>
            </div>

            <div className="modal-body">
              <p className="delete-warning-text">
                Are you sure you want to delete this appointment? 
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
