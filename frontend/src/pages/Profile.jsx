import React, { useState } from 'react';
import './style.css';

const Profile = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError('Please enter a search query');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://127.0.0.1:5000/search_employee?query=${searchQuery}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setSearchResults(data.employees);
            } else {
                setError('No employees found');
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Error fetching employees');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeClick = async (employeeId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/employee_details/${employeeId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setSelectedEmployee(data.employee);
            } else {
                setError('Error fetching employee details');
                setSelectedEmployee(null);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Error fetching employee details');
            setSelectedEmployee(null);
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
        setEditedEmployee({ ...selectedEmployee });
    };

    const handleSaveClick = async () => {
        try {
            const formattedEmployee = {
                ...editedEmployee,
                dateOfBirth: new Date(editedEmployee.dateOfBirth).toISOString().replace('Z', ''),
                dateOfEmployment: new Date(editedEmployee.dateOfEmployment).toISOString().replace('Z', '')
            };
    
            const response = await fetch(`http://127.0.0.1:5000/update_employee/${selectedEmployee.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedEmployee),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            if (data.status === 'success') {
                window.location.reload();
                alert('Employee details updated successfully');
            } else {
                setError('Error updating employee details');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Error updating employee details');
        }
    };
    const handleCancelClick = () => {
        setEditMode(false);
    };

    return (
        <div>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search for an employee"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="input-group-append">
                    <button className="btn btn-primary" type="button" onClick={handleSearch} disabled={loading}>
                        Search
                    </button>
                </div>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {searchResults.length > 0 && (
                <ul className="list-group">
                    {searchResults.map((employee) => (
                        <li
                            key={employee.id}
                            className="list-group-item"
                            onClick={() => handleEmployeeClick(employee.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {employee.firstname} {employee.lastname}
                        </li>
                    ))}
                </ul>
            )}

            {selectedEmployee && (
                <div className="employee-details">
                    <h2>Employee Details</h2>
                    <div className="details-container">
                        {editMode ? (
                            <>
                                <div className="detail">
                                    <label>Firstname:</label>
                                    <input
                                        type="text"
                                        value={editedEmployee.firstname}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, firstname: e.target.value })}
                                    />
                                </div>
                                <div className="detail">
                                    <label>Lastname:</label>
                                    <input
                                        type="text"
                                        value={editedEmployee.lastname}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, lastname: e.target.value })}
                                    />
                                </div>
                                <div className="detail">
                                    <label>Date of Birth:</label>
                                    <input
                                        type="text"
                                        value={editedEmployee.dateOfBirth}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, dateOfBirth: e.target.value })}
                                    />
                                </div>
                                <div className="detail">
                                    <label>Gender:</label>
                                    <input
                                        type="text"
                                        value={editedEmployee.gender}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, gender: e.target.value })}
                                    />
                                </div>
                                <div className="detail">
                                    <label>Contact:</label>
                                    <input
                                        type="text"
                                        value={editedEmployee.contact}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, contact: e.target.value })}
                                    />
                                </div>
                                <div className="detail">
                                    <label>Identification Number:</label>
                                    <input
                                        type="text"
                                        value={editedEmployee.identification_number}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, identification_number: e.target.value })}
                                    />
                                </div>
                                <div className="detail">
                                    <label>Department Number:</label>
                                    <input
                                        type="text"
                                        value={editedEmployee.department_number}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, department_number: e.target.value })}
                                    />
                                </div>
                                <div className="detail">
                                    <label>Date of Employment:</label>
                                    <input
                                        type="text"
                                        value={editedEmployee.dateOfEmployment}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, dateOfEmployment: e.target.value })}
                                    />
                                </div>
                                <div className="detail">
                                    <label>Contract Period:</label>
                                    <input
                                        type="text"
                                        value={editedEmployee.contractPeriod}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, contractPeriod: e.target.value })}
                                    />
                                </div>
                                <div className="detail">
                                    <label>Job:</label>
                                    <input
                                        type="text"
                                        value={editedEmployee.job}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, job: e.target.value })}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="detail">
                                    <label>Firstname:</label>
                                    <p>{selectedEmployee.firstname}</p>
                                </div>
                                <div className="detail">
                                    <label>Lastname:</label>
                                    <p>{selectedEmployee.lastname}</p>
                                </div>
                                <div className="detail">
                                    <label>Date of Birth:</label>
                                    <p>{selectedEmployee.dateOfBirth}</p>
                                </div>
                                <div className="detail">
                                    <label>Gender:</label>
                                    <p>{selectedEmployee.gender}</p>
                                </div>
                                <div className="detail">
                                    <label>Contact:</label>
                                    <p>{selectedEmployee.contact}</p>
                                </div>
                                <div className="detail">
                                    <label>Identification Number:</label>
                                    <p>{selectedEmployee.identification_number}</p>
                                </div>
                                <div className="detail">
                                    <label>Department Number:</label>
                                    <p>{selectedEmployee.department_number}</p>
                                </div>
                                <div className="detail">
                                    <label>Date of Employment:</label>
                                    <p>{selectedEmployee.dateOfEmployment}</p>
                                </div>
                                <div className="detail">
                                    <label>Contract Period:</label>
                                    <p>{selectedEmployee.contractPeriod}</p>
                                </div>
                                <div className="detail">
                                    <label>Job:</label>
                                    <p>{selectedEmployee.job}</p>
                                </div>
                            </>
                        )}
                    </div>
                    {!editMode && <button onClick={handleEditClick}>Edit</button>}
                    {editMode && (
                        <>
                            <button onClick={handleSaveClick}>Save</button>
                            <button onClick={handleCancelClick}>Cancel</button>
                        </>
                    )}
                </div>
            )}





            {selectedEmployee && (
                <div>
                    <h2>Documents</h2>
                    <ul className="documents-list">
                        {selectedEmployee.documents.map((document) => (
                            <li key={document.id} className="document-card">
                                <div className="document-info">
                                    <div className="document-info-item">
                                        <strong>Passport:</strong> {document.passport_filepath}
                                    </div>
                                    <div className="document-info-item">
                                        <strong>ID Copy:</strong> {document.IdCopy_filepath}
                                    </div>
                                    <div className="document-info-item">
                                        <strong>Chief Letter:</strong> {document.ChiefLetter_filepath}
                                    </div>
                                    <div className="document-info-item">
                                        <strong>Clearance Letter:</strong> {document.ClearanceLetter_filepath}
                                    </div>
                                    <div className="document-info-item">
                                        <strong>Reference:</strong> {document.Reference_filepath}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Profile;
