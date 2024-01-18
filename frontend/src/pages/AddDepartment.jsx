import React, { useState } from 'react';

function AddDepartment() {
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentHead: '',
    Location: '', 
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://127.0.0.1:5000/add_department', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error adding department: ${response.statusText}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setSuccessMessage(responseData.message);
        setErrorMessage('');
        setFormData({
          departmentName: '',
          departmentHead: '',
          Location: '',
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage(error.message || 'Error adding department');
        setSuccessMessage('');
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginTop: '20px', color: 'blue' }}>
        <h2>Add Department</h2>
      </div>

      <div style={{ width: '60%', alignSelf: 'center', marginTop: '20px', maxWidth: '400px' }}>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div style={{ width: '60%', alignSelf: 'center', marginTop: '20px', maxWidth: '400px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="departmentName">Department Name</label>
            <input
              type="text"
              className="form-control"
              id="departmentName"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="departmentHead">Department Head</label>
            <input
              type="text"
              className="form-control"
              id="departmentHead"
              name="departmentHead"
              value={formData.departmentHead}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              className="form-control"
              id="Location"
              name="Location"
              value={formData.Location}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group" style={{ marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ transition: 'background-color 0.3s' }}>
              Add Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDepartment;
