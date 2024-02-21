import React, { useState, useEffect } from 'react';

function AddAssignment() {
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentHead: '', // Changed to hold employee ID instead of name
    Location: '', 
  });
  const [employees, setEmployees] = useState([]); // State variable to hold the list of employees

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch list of employees when component mounts
    fetch('http://127.0.0.1:5000/select_hod')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setEmployees(data.employees);
        } else {
          setEmployees([]);
          setErrorMessage('Error fetching employees');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setEmployees([]);
        setErrorMessage('Error fetching employees');
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://127.0.0.1:5000/add_assignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error adding assignment: ${response.statusText}`);
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
        setErrorMessage(error.message || 'Error adding assignment');
        setSuccessMessage('');
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginTop: '20px', color: 'blue' }}>
        <h2>Add Assignment</h2>
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
            <select
              className="form-control"
              id="departmentHead"
              name="departmentHead"
              value={formData.departmentHead}
              onChange={handleInputChange}
            >
              <option value="">Select Head of Department</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>{employee.firstname} {employee.lastname}</option>
              ))}
            </select>
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
              Add Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAssignment;
