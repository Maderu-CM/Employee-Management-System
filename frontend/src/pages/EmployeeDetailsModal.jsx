import React from 'react';

const EmployeeDetailsModal = ({ selectedEmployee, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
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
                        <p>Documents:</p>
                        <ul>
                            {selectedEmployee.documents.map((document, index) => (
                                <li key={index}>
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
        </div>
    );
};

export default EmployeeDetailsModal;
