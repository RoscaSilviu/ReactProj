import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
const AppointmentScheduler = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mechanic: null,
    date: null,
    time: '',
    carBrand: '',
    carModel: '',
    year: '',
    description: '',
  });

  const mechanics = [
    { id: 1, name: 'Ion Popescu', specialization: 'Motor și Transmisie', rating: 4.8, availableSlots: ['09:00', '11:00', '14:00'] },
    { id: 2, name: 'Maria Ionescu', specialization: 'Sisteme Electrice', rating: 4.9, availableSlots: ['10:00', '13:00', '15:00'] },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMechanicSelect = (mechanic) => {
    setFormData({
      ...formData,
      mechanic: mechanic,
    });
  };

  const handleDateSelect = (date) => {
    if (date) {
      setFormData({
        ...formData,
        date: date,
      });
    }
  };

  const handleTimeSelect = (time) => {
    setFormData({
      ...formData,
      time: time,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStep(4); // Success step
      }
    } catch (error) {
      console.error('Error miau miau:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="mb-3">Selectați Mecanic, Data și Ora</h3>
            <div className="mb-3">
              <h5>Mecanici Disponibili</h5>
              {mechanics.map((mechanic) => (
                <div key={mechanic.id} className="card mb-3">
                  <div className="card-body">
                    <h5>{mechanic.name}</h5>
                    <p>{mechanic.specialization}</p>
                    <button
                      className={`btn ${formData.mechanic?.id === mechanic.id ? 'btn-success' : 'btn-primary'}`}
                      onClick={() => handleMechanicSelect(mechanic)}
                    >
                      {formData.mechanic?.id === mechanic.id ? 'Selectat' : 'Selectează'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {formData.mechanic && (
              <div className="mb-3">
                <h5>Selectați Data</h5>
                <DatePicker
                  value={formData.date}
                  onChange={handleDateSelect}
                  className="form-control mb-3"
                  minDate={new Date()}
                  required
                />
              </div>
            )}
            {formData.date && (
              <div className="mb-3">
                <h5>Selectați Ora</h5>
                {formData.mechanic && formData.mechanic.availableSlots.map((time) => (
                  <button
                    key={time}
                    className={`btn me-2 ${formData.time === time ? 'btn-success' : 'btn-outline-primary'}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
            <button
              className="btn btn-primary w-100"
              disabled={!formData.mechanic || !formData.date || !formData.time}
              onClick={() => setStep(2)}
            >
              Continuă
            </button>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="mb-3">Introduceți Detaliile Vehiculului</h3>
            <input
              type="text"
              name="carBrand"
              placeholder="Marca mașină"
              value={formData.carBrand}
              onChange={handleInputChange}
              className="form-control mb-3"
            />
            <input
              type="text"
              name="carModel"
              placeholder="Model mașină"
              value={formData.carModel}
              onChange={handleInputChange}
              className="form-control mb-3"
            />
            <input
              type="number"
              name="year"
              placeholder="An fabricație"
              value={formData.year}
              onChange={handleInputChange}
              className="form-control mb-3"
            />
            <textarea
              name="description"
              placeholder="Descriere problemă"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control mb-3"
            />
            <button onClick={() => setStep(3)} className="btn btn-primary w-100">
              Continuă
            </button>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="mb-3">Confirmare Programare</h3>
            <div className="mb-3">
              <p><strong>Mecanic:</strong> {formData.mechanic?.name}</p>
              <p><strong>Specializare:</strong> {formData.mechanic?.specialization}</p>
              <p><strong>Data:</strong> {formData.date?.toLocaleDateString()}</p>
              <p><strong>Ora:</strong> {formData.time}</p>
              <p><strong>Mașină:</strong> {formData.carBrand} {formData.carModel}</p>
              <p><strong>An:</strong> {formData.year}</p>
              <p><strong>Problemă:</strong> {formData.description}</p>
            </div>
            <button
              onClick={handleSubmit}
              className="btn btn-success w-100"
            >
              Confirmă Programarea
            </button>
          </div>
        );

      case 4:
        return (
          <div className="alert alert-success" role="alert">
            Programarea a fost înregistrată cu succes! Veți primi un email de confirmare.
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: '600px' }}>
      <div className="card-header">
        <h4 className="card-title mb-0">Programare Service</h4>
      </div>
      <div className="card-body">{renderStep()}</div>
    </div>
  );
};

export default AppointmentScheduler;
