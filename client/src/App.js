// client/src/App.js

import React, { useState } from 'react';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: ''
  });
  const [submitMessage, setSubmitMessage] = useState('');

  const handleOpenForm = () => {
    setShowForm(true);
    setSubmitMessage('');
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      service_type: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Updated endpoint to /book-call:
      const response = await fetch('http://localhost:5000/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitMessage('Thank you! Your booking was submitted successfully.');
      } else {
        setSubmitMessage(`Error: ${data.error || 'Could not submit booking'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Submission failed. Try again later.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '2rem' }}>
      <h1>Consulting Website - Home Page</h1>
      <button
        style={{ padding: '10px 20px', cursor: 'pointer' }}
        onClick={handleOpenForm}
      >
        Book Now
      </button>

      {showForm && (
        <div
          style={{
            border: '1px solid #ccc',
            marginTop: '1rem',
            padding: '1rem',
            maxWidth: '400px'
          }}
        >
          <h2>Book a Quick Call</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Name: </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Email: </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Phone: </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Type of Service: </label>
              <input
                type="text"
                name="service_type"
                maxLength={20}
                value={formData.service_type}
                onChange={handleChange}
              />
              <small style={{ display: 'block' }}>
                (Max 20 characters)
              </small>
            </div>

            <button type="submit" style={{ padding: '6px 12px', cursor: 'pointer' }}>
              Submit
            </button>
            <button
              type="button"
              onClick={handleCloseForm}
              style={{ marginLeft: '1rem', padding: '6px 12px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </form>

          {submitMessage && (
            <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
              {submitMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
