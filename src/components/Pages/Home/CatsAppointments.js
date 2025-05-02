import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../../context/AuthContext';
import { PencilSquare, Trash, PersonGear } from 'react-bootstrap-icons';
import './miau.css';

const CatAppointmentManagement = () => {
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

  const fetchCatAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/cat/appointments/${localStorage.getItem('catId')}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch cat appointments');

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching cat appointments:', error);
      alert('Eroare la încărcarea programărilor.');
    } finally {
      setIsLoading(false);
    }
  }, [setIsAuthenticated]);

  useEffect(() => {
    fetchCatAppointments();
  }, [fetchCatAppointments]);

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

      if (!response.ok) throw new Error('Actualizarea a eșuat');

      const updatedAppointment = await response.json();
      setAppointments(prev => prev.map(a => 
        a.id === selectedAppointment.id ? updatedAppointment : a
      ));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Eroare la actualizare:', error);
      alert('Eroare la actualizarea programării.');
    }
  };

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

      if (!response.ok) throw new Error('Ștergerea a eșuat');

      setAppointments(prev => 
        prev.filter(a => a.id !== selectedAppointment.id)
      );
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Eroare la ștergere:', error);
      alert('Eroare la ștergerea programării.');
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
          <h4 className="empty-title">Nu există programări asociate</h4>
          <p className="empty-subtitle">Momentan nu aveți programări asociate.</p>
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
            Programările Mele
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
                      <span className="detail-label">Data:</span>
                      <span className="detail-value">
                        {new Date(appointment.date).toLocaleDateString('ro-RO')} 
                        <span className="time-badge">{appointment.time}</span>
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Descriere:</span>
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
                Editare Programare
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
                  <label>Marca Mașină</label>
                  <input
                    className="form-control"
                    name="carBrand"
                    value={editForm.carBrand}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Model Mașină</label>
                  <input
                    className="form-control"
                    name="carModel"
                    value={editForm.carModel}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>An Fabricație</label>
                  <input
                    className="form-control"
                    name="year"
                    type="number"
                    value={editForm.year}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group-full">
                  <label>Descriere Problemă</label>
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
                Renunță
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Salvează modificări
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
                Confirmare ștergere
              </h4>
            </div>

            <div className="modal-body">
              <p className="delete-warning-text">
                Ești sigur că vrei să ștergi această programare? 
                Această acțiune este permanentă și nu poate fi anulată.
              </p>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Anulează
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Șterge definitiv
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatAppointmentManagement;