import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Extract userId from localStorage
  
      const response = await fetch(`http://localhost:5000/appointments?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}` // Authentication token
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle edit dialog
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

  const handleEditInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  // Update appointment
  const handleUpdate = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5000/appointments/${selectedAppointment.id}?userId=${userId}`, {
          method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...editForm,
          year: parseInt(editForm.year, 10)
        })
      });

      if (response.ok) {
        // Update the appointments state after the update
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment.id === selectedAppointment.id ? { ...appointment, ...editForm } : appointment
          )
        );
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  // Delete appointment
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/appointments/${selectedAppointment.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        // Remove the deleted appointment from the state
        setAppointments(prevAppointments =>
          prevAppointments.filter(appointment => appointment.id !== selectedAppointment.id)
        );
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Gestionare Programări</h5>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 d-flex justify-content-between align-items-start">
                <div>
                  <p className="font-weight-bold">{appointment.carBrand} {appointment.carModel} ({appointment.year})</p>
                  <p className="text-muted">Mecanic: {appointment.mechanic}</p>
                  <p className="text-muted">
                    Data: {new Date(appointment.date).toLocaleDateString()} {appointment.time}
                  </p>
                  <p className="mt-2">{appointment.description}</p>
                </div>
                <div className="space-x-2">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => openEditDialog(appointment)}
                  >
                    Editează
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Șterge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editare Programare</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditDialogOpen(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Marca Mașină</label>
                  <input
                    className="form-control"
                    name="carBrand"
                    value={editForm.carBrand}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Model Mașină</label>
                  <input
                    className="form-control"
                    name="carModel"
                    value={editForm.carModel}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">An Fabricație</label>
                  <input
                    className="form-control"
                    name="year"
                    type="number"
                    value={editForm.year}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descriere Problemă</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsEditDialogOpen(false)}>Anulează</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Salvează</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmare ștergere</h5>
                <button type="button" className="btn-close" onClick={() => setIsDeleteDialogOpen(false)}></button>
              </div>
              <div className="modal-body">
                <p>Sunteți sigur că doriți să ștergeți această programare? Această acțiune nu poate fi anulată.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsDeleteDialogOpen(false)}>Anulează</button>
                <button className="btn btn-danger" onClick={handleDelete}>Șterge</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
