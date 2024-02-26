import React, { useState } from 'react';

const Profile = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                <div>
                    <h2>Employee Details</h2>
                    <p>Firstname: {selectedEmployee.firstname}</p>
                    <p>Lastname: {selectedEmployee.lastname}</p>
                    <p>Date of Birth: {selectedEmployee.dateOfBirth}</p>
                    <p>Gender: {selectedEmployee.gender}</p>
                    <p>Contact: {selectedEmployee.contact}</p>
                    <p>Identification Number: {selectedEmployee.identification_number}</p>
                    <p>Department Number: {selectedEmployee.department_number}</p>
                    <p>Date of Employment: {selectedEmployee.dateOfEmployment}</p>
                    <p>Contract Period: {selectedEmployee.contractPeriod}</p>
                    <p>Job: {selectedEmployee.job}</p>

                    <h2>Documents</h2>
                    <ul>
                        {selectedEmployee.documents.map((document) => (
                            <li key={document.id}>
                                Document ID: {document.id}<br />
                                Passport Filepath: {document.passport_filepath}<br />
                                ID Copy Filepath: {document.IdCopy_filepath}<br />
                                Chief Letter Filepath: {document.ChiefLetter_filepath}<br />
                                Clearance Letter Filepath: {document.ClearanceLetter_filepath}<br />
                                Reference Filepath: {document.Reference_filepath}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Profile;
