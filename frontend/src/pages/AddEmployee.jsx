import React, { useState, useEffect } from 'react';

function AddEmployee() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        date_of_birth: '',
        gender: '',
        contact: '',
        identification_number: '',
        department_name: '', 
        date_of_employment: '',
        contract_period: '',
        job: ''
    });
    const [assignments, setAssignments] = useState([]); // State to store the fetched assignments
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch list of assignments
        fetch('http://127.0.0.1:5000/select_department')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setAssignments(data.assignments);
                } else {
                    setAssignments([]);
                    setErrorMessage('Error fetching assignments');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setAssignments([]);
                setErrorMessage('Error fetching assignments');
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Error adding employee');
            }
            const data = await response.json();
            setSuccessMessage(data.message);
            setErrorMessage('');
            setFormData({
                firstname: '',
                lastname: '',
                date_of_birth: '',
                gender: '',
                contact: '',
                identification_number: '',
                department_name: '',
                date_of_employment: '',
                contract_period: '',
                job: ''
            });
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || 'Error adding employee');
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <h2>Register Employee</h2>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input type="text" name="firstname" value={formData.firstname} onChange={handleInputChange} required />
                </label><br />
                <label>
                    Last Name:
                    <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} required />
                </label><br />
                <label>
                    Date of Birth:
                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} required />
                </label><br />
                <label>
                    Gender:
                    <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label><br />
                <label>
                    Contact:
                    <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} required />
                </label><br />
                <label>
                    Identification Number:
                    <input type="text" name="identification_number" value={formData.identification_number} onChange={handleInputChange} required />
                </label><br />
                <label>
                    Department Name:
                    <select name="department_name" value={formData.department_name} onChange={handleInputChange} required>
                        <option value="">Select Department</option>
                        {assignments.map(assignment => (
                            <option key={assignment.departmentName} value={assignment.departmentName}>{assignment.departmentName}</option>
                        ))}
                    </select>
                </label><br />
                <label>
                    Date of Employment:
                    <input type="date" name="date_of_employment" value={formData.date_of_employment} onChange={handleInputChange} required />
                </label><br />
                <label>
                    Contract Period:
                    <input type="text" name="contract_period" value={formData.contract_period} onChange={handleInputChange} required />
                </label><br />
                <label>
                    Job:
                    <input type="text" name="job" value={formData.job} onChange={handleInputChange} required />
                </label><br />
                
                <button type="submit">Add Employee</button>
            </form>
        </div>
    );
}

export default AddEmployee;
