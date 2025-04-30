import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';

const AppointmentScheduler = () => {
  const [mechanics, setMechanics] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userId: parseInt(localStorage.getItem('userId')),
    mechanicId: null,
    date: null,
    time: '',
    carBrand: '',
    carModel: '',
    year: '',
    description: '',
  });

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await fetch('http://localhost:5000/mechanics');
        const data = await response.json();
        setMechanics(data);
      } catch (err) {
        setError('Error fetching the cats');
      }
    };
    fetchMechanics();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMechanicSelect = (mechanic) => {
    setSelectedMechanic(mechanic);
    setFormData(prev => ({
      ...prev,
      mechanicId: mechanic.id,
      date: null,
      time: ''
    }));
  };

  const handleDateSelect = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date,
      time: ''
    }));
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      time: time
    }));
  };

  const validateStep1 = () => {
    if (!formData.mechanicId) return 'Select a cat';
    if (!formData.date) return 'Select a date';
    if (!formData.time) return 'Select a time';
    return null;
  };

  const validateStep2 = () => {
    const requiredFields = ['carBrand', 'carModel', 'year', 'description'];
    for (const field of requiredFields) {
      if (!formData[field]) return `Complete the field: ${field}`;
    }
    if (formData.year < 1900 || formData.year > new Date().getFullYear()) {
      return 'Invalid year';
    }
    return null;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/create-appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD
          year: parseInt(formData.year)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erorr creating appointment');
      }

      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="mb-3">Select the cat, date and time</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3">
              <h5>Available cats</h5>
              <div className="row row-cols-1 g-3">
                {mechanics.map((mechanic) => (
                  <div key={mechanic.id} className="col">
                    <div className={`card ${selectedMechanic?.id === mechanic.id ? 'border-primary' : ''}`}>
                      <div className="card-body">
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={mechanic.image} 
                            alt={mechanic.name} 
                            className="rounded-circle" 
                            style={{width: '60px', height: '60px', objectFit: 'cover'}}
                          />
                          <div>
                            <h5 className="mb-1">{mechanic.name}</h5>
                            <p className="text-muted mb-1">{mechanic.specialization}</p>
                            <div className="d-flex gap-2">
                              <span className="badge bg-info">
                                Rating: {mechanic.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          className={`btn btn-sm mt-2 ${
                            selectedMechanic?.id === mechanic.id 
                            ? 'btn-primary' 
                            : 'btn-outline-primary'
                          }`}
                          onClick={() => handleMechanicSelect(mechanic)}
                        >
                          {selectedMechanic?.id === mechanic.id ? 'Selectat' : 'Selectează'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedMechanic && (
              <>
                <div className="mb-3">
                  <h5>Selectați Data</h5>
                  <DatePicker
                    value={formData.date}
                    onChange={handleDateSelect}
                    className="form-control mb-3"
                    minDate={new Date()}
                    format="dd/MM/yyyy"
                    required
                  />
                </div>

                {formData.date && (
                  <div className="mb-3">
                    <h5>Ore Disponibile</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedMechanic.availableSlots.map((time) => (
                        <button
                          key={time}
                          className={`btn btn-sm ${
                            formData.time === time 
                            ? 'btn-success' 
                            : 'btn-outline-secondary'
                          }`}
                          onClick={() => handleTimeSelect(time)}
                          disabled={!selectedMechanic.availableSlots.includes(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              className="btn btn-primary w-100"
              disabled={!formData.mechanicId || !formData.date || !formData.time}
              onClick={() => {
                const error = validateStep1();
                if (error) {
                  setError(error);
                } else {
                  setError('');
                  setStep(2);
                }
              }}
            >
              Continue
            </button>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="mb-3">Appointment details</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="carBrand"
                  placeholder="First name"
                  value={formData.carBrand}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="carModel"
                  placeholder="Last name"
                  value={formData.carModel}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-12">
                <input
                  type="number"
                  name="year"
                  placeholder="Age"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="form-control"
                  min="18"
                  max="100"
                />
              </div>
              <div className="col-12">
                <textarea
                  name="description"
                  placeholder="Tell us what you want to achieve during your appointment"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="4"
                />
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button 
                className="btn btn-secondary" 
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="btn btn-primary flex-grow-1"
                onClick={() => {
                  const error = validateStep2();
                  if (error) {
                    setError(error);
                  } else {
                    setError('');
                    setStep(3);
                  }
                }}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="mb-3">Confirm appointment</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Appointment details</h5>
                <dl className="row mb-0">
                  <dt className="col-sm-4">Cat</dt>
                  <dd className="col-sm-8">{selectedMechanic?.name}</dd>

                  <dt className="col-sm-4">Date and time</dt>
                  <dd className="col-sm-8">
                    {formData.date?.toLocaleDateString()} {formData.time}
                  </dd>

                  <dt className="col-sm-4">Personal information</dt>
                  <dd className="col-sm-8">
                    {formData.carBrand} {formData.carModel} ({formData.year})
                  </dd>

                  <dt className="col-sm-4">Description</dt>
                  <dd className="col-sm-8">{formData.description}</dd>
                </dl>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button 
                className="btn btn-secondary" 
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                className="btn btn-success flex-grow-1"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm appointment'}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="alert alert-success">
              Appointment
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setStep(1);
                setSelectedMechanic(null);
                setFormData({
                  ...formData,
                  mechanicId: null,
                  date: null,
                  time: '',
                  carBrand: '',
                  carModel: '',
                  year: '',
                  description: '',
                });
              }}
            >
              New appointment
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: '800px' }}>
        <div className="card-header bg-primary text-white">
          <h2 className="card-title mb-0">Cat visitation appointment</h2>
        </div>
        <div className="card-body p-4">{renderStep()}</div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;