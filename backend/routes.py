from flask import jsonify
from flask import  render_template, request
from app import app,db, Employee, Assignment, Document
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

from datetime import datetime

CORS(app)

app.config['JWT_SECRET_KEY'] = 'kjsfhiuyrnAUTdjhddjlkjfeadDAlHgDM'

# Adding an employee

@app.route('/addemployee', methods=['POST'])
def create_employee():
    try:
        data = request.json

        # Validate request data
        required_fields = ['firstname', 'lastname', 'dateOfBirth', 'gender', 'contact',
                           'identification_number', 'department_name', 'dateOfEmployment',
                           'contractPeriod', 'job']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            error_message = f'Missing fields: {", ".join(missing_fields)}'
            print(f'Error adding employee: {error_message}')  # Print error message to console
            return jsonify({'error': error_message}), 400

        # Convert date strings to datetime objects
        date_of_birth = datetime.strptime(data['dateOfBirth'], '%Y-%m-%d')
        date_of_employment = datetime.strptime(data['dateOfEmployment'], '%Y-%m-%d')

        # Query department based on department name
        department = Assignment.query.filter_by(departmentName=data['department_name']).first()
        if not department:
            error_message = f'Department not found for department name: {data["department_name"]}'
            print(f'Error adding employee: {error_message}')  # Print error message to console
            return jsonify({'error': error_message}), 404

        # Create new employee instance
        new_employee = Employee(
            firstname=data['firstname'],
            lastname=data['lastname'],
            dateOfBirth=date_of_birth,
            gender=data['gender'],
            contact=data['contact'],
            identification_number=data['identification_number'],
            department_number=department.departmentnumber,
            dateOfEmployment=date_of_employment,
            contractPeriod=data['contractPeriod'],
            job=data['job']
        )

        # Add employee to the database session and commit changes
        db.session.add(new_employee)
        db.session.commit()

        # Return the employee_id of the newly created employee
        return jsonify({'message': 'Employee created successfully', 'employee_id': new_employee.id}), 201

    except Exception as e:
        error_message = f'An error occurred: {str(e)}'
        print(f'Error adding employee: {error_message}')  # Print error message to console
        return jsonify({'error': error_message}), 500

#uploading new employee's document
UPLOAD_FOLDER = 'uploads'  
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}  # Allowed file extensions

# Function to check if file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route for uploading documents for a specific employee
# Route for uploading documents for a specific employee
@app.route('/upload_document/<int:employee_id>', methods=['POST'])
def upload_document(employee_id):
    try:
        # Check if employee exists
        employee = Employee.query.get(employee_id)
        if not employee:
            error_message = f'Employee not found with ID: {employee_id}'
            print(f'Error uploading documents: {error_message}')  # Print error message to console
            return jsonify({'error': error_message}), 404

        # Check if the POST request has the file parts
        if 'passportFile' not in request.files or 'idCopyFile' not in request.files or 'chiefLetterFile' not in request.files or 'clearanceLetterFile' not in request.files or 'referenceFile' not in request.files:
            error_message = 'One or more files missing in the request'
            print(f'Error uploading documents: {error_message}')  # Print error message to console
            return jsonify({'error': error_message}), 400

        passport_file = request.files['passportFile']
        id_copy_file = request.files['idCopyFile']
        chief_letter_file = request.files['chiefLetterFile']
        clearance_letter_file = request.files['clearanceLetterFile']
        reference_file = request.files['referenceFile']

        # Check if any file is empty
        if passport_file.filename == '' or id_copy_file.filename == '' or chief_letter_file.filename == '' or clearance_letter_file.filename == '':
            error_message = 'One or more files are empty'
            print(f'Error uploading documents: {error_message}')  # Print error message to console
            return jsonify({'error': error_message}), 400

        # Check if the file extensions are allowed
        if not all(allowed_file(file.filename) for file in [passport_file, id_copy_file, chief_letter_file, clearance_letter_file, reference_file]):
            error_message = 'One or more files have disallowed extensions'
            print(f'Error uploading documents: {error_message}')  # Print error message to console
            return jsonify({'error': error_message}), 400

        # Create directory if it does not exist
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        # Save the files
        passport_filepath = os.path.join(UPLOAD_FOLDER, secure_filename(passport_file.filename))
        id_copy_filepath = os.path.join(UPLOAD_FOLDER, secure_filename(id_copy_file.filename))
        chief_letter_filepath = os.path.join(UPLOAD_FOLDER, secure_filename(chief_letter_file.filename))
        clearance_letter_filepath = os.path.join(UPLOAD_FOLDER, secure_filename(clearance_letter_file.filename))
        reference_filepath = os.path.join(UPLOAD_FOLDER, secure_filename(reference_file.filename))

        passport_file.save(passport_filepath)
        id_copy_file.save(id_copy_filepath)
        chief_letter_file.save(chief_letter_filepath)
        clearance_letter_file.save(clearance_letter_filepath)
        reference_file.save(reference_filepath)

        # Update document file paths in the database
        document = Document(
            employee_id=employee_id,
            passport_filepath=passport_filepath,
            IdCopy_filepath=id_copy_filepath,
            ChiefLetter_filepath=chief_letter_filepath,
            ClearanceLetter_filepath=clearance_letter_filepath,
            Reference_filepath=reference_filepath
        )
        db.session.add(document)
        db.session.commit()

        return jsonify({'message': 'Documents uploaded successfully'}), 200
    except Exception as e:
        error_message = f'An error occurred: {str(e)}'
        print(f'Error uploading documents: {error_message}')  # Print error message to console
        return jsonify({'error': error_message}), 500

    except Exception as e:
        error_message = f'An error occurred: {str(e)}'
        print(f'Error uploading documents: {error_message}')  # Print error message to console
        return jsonify({'error': error_message}), 500

# Add a assignment
@app.route('/add_assignment', methods=['POST'])
def add_assignment():
    try:
        data = request.get_json()

        # Check if all required fields are present
        required_fields = ['departmentName', 'departmentHead', 'Location']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

        # Validate data types
        if not all(isinstance(data[field], str) for field in ['departmentName', 'departmentHead', 'Location']):
            return jsonify({'error': 'Invalid data types. Expected strings for all fields.'}), 400

        # Create a new assignment instance
        new_assignment = Assignment(
            departmentName=data['departmentName'],
            departmentHead=data['departmentHead'],
            Location=data['Location']
        )

        # Add the new assignment to the database session and commit changes
        db.session.add(new_assignment)
        db.session.commit()

        return jsonify({'message': 'New Department registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# view employees
@app.route('/employees', methods=['GET'])
def view_employees():
    try:
        page = request.args.get('page', default=1, type=int)
        page_size = request.args.get('pageSize', default=10, type=int)

        offset = (page - 1) * page_size

        employees = Employee.query.offset(offset).limit(page_size).all()

        employee_list = []
        for employee in employees:
            employee_data = {
                'id': employee.id,
                'firstname': employee.firstname,
                'lastname': employee.lastname,
                'contact': employee.contact,
              
            }
            employee_list.append(employee_data)

        return jsonify({'status': 'success', 'employees': employee_list}),200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}),400

#selection of department head
@app.route('/select_hod', methods=['GET'])
def select_hod():
    try:
        

        employees = Employee.query.all()

        employee_list = []
        for employee in employees:
            employee_data = {
               
                'firstname': employee.firstname,
                'lastname': employee.lastname,
               
            }
            employee_list.append(employee_data)

        return jsonify({'status': 'success', 'employees': employee_list}),200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}),400


# view details of a specific user.
@app.route('/employees/<int:employee_id>', methods=['GET'])
def view_employee(employee_id):
    try:
        employee = Employee.query.get(employee_id)

        if employee:
            employee_data = {
                'firstname': employee.firstname,
                'midint': employee.midint,
                'lastname': employee.lastname,
                'gender': employee.gender,
                'contact': employee.contact,
                'departmentname': employee.department.departmentName,
                'hiredate': employee.hiredate.strftime('%d-%m-%Y-'),
                'educationlevel': employee.educationlevel,
                'job': employee.job,
                'salary': employee.salary,
                'bonus': employee.bonus,
                'commission': employee.commission
            }
            response_data = {'status': 'success', 'employee': employee_data}
        else:
            response_data = {'status': 'error', 'message': 'Employee not found'}

        return jsonify(response_data)

    except Exception as e:
        response_data = {'status': 'error', 'message': str(e)}
        return jsonify(response_data)

# Retrieve and update employee's details
@app.route('/edit_employee/<int:employee_id>', methods=['GET', 'POST'])
def edit_employee(employee_id):
    try:
        employee = Employee.query.get(employee_id)

        if request.method == 'GET':
            if employee:
                return render_template('employee.html', employee=employee)
            else:
                return jsonify({'status': 'error', 'message': 'Employee not found'}), 404

        elif request.method == 'POST':
            if employee:
                try:
                    json_data = request.get_json()

                    if json_data:
                        hiredate_str = json_data.get('hiredate')
                        if hiredate_str:
                            employee.hiredate = datetime.strptime(hiredate_str, '%Y-%m-%d')

                        employee.firstname = json_data.get('firstname')
                        employee.midint = json_data.get('midint')
                        employee.lastname = json_data.get('lastname')
                        employee.gender = json_data.get('gender')
                        employee.contact = json_data.get('contact')

                        department_name = json_data.get('departmentname')
                        if department_name:
                            assignment =Assignment.query.filter_by(departmentName=department_name).first()
                            if assignment:
                                employee.assignment= assignment

                        employee.educationlevel = json_data.get('educationlevel')
                        employee.job = json_data.get('job')
                        employee.salary = json_data.get('salary')
                        employee.bonus = json_data.get('bonus')
                        employee.commission = json_data.get('commission')

                        db.session.commit()

                        return jsonify({'status': 'success', 'message': 'Employee updated successfully'}), 200
                    else:
                        return jsonify({'status': 'error', 'message': 'Invalid JSON data'}), 400
                except Exception as e:
                    return jsonify({'status': 'error', 'message': str(e)}), 500
            else:
                return jsonify({'status': 'error', 'message': 'Employee not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Delete an employee
@app.route('/delete_employee/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    try:
        # Retrieve the employee by ID
        employee = Employee.query.get(employee_id)
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        
        # Delete the associated documents
        documents = Document.query.filter_by(employee_id=employee_id).all()
        for document in documents:
            db.session.delete(document)
        
        # Delete the employee
        db.session.delete(employee)
        db.session.commit()

        return jsonify({'message': 'Employee and associated documents deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# fetching assignments
@app.route('/assignments', methods=['GET'])
def get_assignments():
    try:
        assignments = Assignment.query.all()

        assignment_list = []
        for assignment in assignments:
            assignment_data = {
                'departmentnumber': assignment.departmentnumber,
                'departmentName': assignment.departmentName,
                'departmentHead': assignment.departmentHead,
                'Location': assignment.Location
            }
            assignment_list.append(assignment_data)

        return jsonify({'status': 'success', 'assignments': assignment_list}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    

#select departments
@app.route('/select_department', methods=['GET'])
def select_department():
    try:
        assignments = Assignment.query.all()

        assignment_list = []
        for assignment in assignments:
            assignment_data = {
                
                'departmentName': assignment.departmentName
               
               
            }
            assignment_list.append(assignment_data)

        return jsonify({'status': 'success', 'assignments': assignment_list}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

    
#employee selection
@app.route('/employee_selection', methods=['GET'])
def get_employees():
    try:
        employees = Employee.query.all()

        employee_list = []
        for employee in employees:
            employee_data = {
                'firstname': employee.firstname,
                'lastname': employee.lastname
                
              
            }
        employee_list.append(employee_data)

        return jsonify({'status': 'success', 'employees': employee_list}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
 


# deleting a department
@app.route('/delete_assignment/<int:departmentnumber>', methods=['DELETE'])
def delete_assignment(departmentnumber):
    try:
        assignment =Assignment.query.get(departmentnumber)

        if assignment:
            # Delete the associated employees
            for employee in assignment.employees:
                db.session.delete(employee)

            # Delete the assignment
            db.session.delete(assignment)
            db.session.commit()

            return jsonify({'status': 'success', 'message': 'Assignment and associated employees deleted successfully'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Assignment not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Retrieve and update department's details


@app.route('/edit_department/<int:departmentNumber>', methods=['GET', 'POST'])
def edit_department(departmentNumber):
    try:
        # Attempt to retrieve the Assignment object
        assignment = Assignment.query.get(departmentNumber)

        if not assignment:
            return jsonify({'status': 'error', 'message': 'Assignment not found'}), 404

        if request.method == 'GET':
            return render_template('department.html', assignment=assignment)

        elif request.method == 'POST':
            # Access form data using request.json instead of request.form
            data = request.json
            
            # Check if required fields are present and not empty
            if 'departmentName' not in data or not data['departmentName'].strip():
                return jsonify({'status': 'error', 'message': 'Department name is required'}), 400
            
            if 'departmentHead' not in data or not data['departmentHead'].strip():
                return jsonify({'status': 'error', 'message': 'Department head is required'}), 400
            
            if 'Location' not in data or not data['Location'].strip():
                return jsonify({'status': 'error', 'message': 'Location is required'}), 400

            # Update assignment fields
            assignment.departmentName = data['departmentName']
            assignment.departmentHead = data['departmentHead']
            assignment.Location = data['Location']

            db.session.commit()

            return jsonify({'status': 'success', 'message': 'Department updated successfully'}), 200

    except Exception as e:
        # Handle any exceptions that may occur during the assignment retrieval process
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

#retrieve employee's details 
@app.route('/employee_details/<int:employee_id>', methods=['GET'])
def get_employee_details(employee_id):
    try:
        employee = Employee.query.get(employee_id)
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404

        # Query documents associated with the employee
        documents = Document.query.filter_by(employee_id=employee_id).all()

        # Construct a dictionary containing the employee's details
        employee_data = {
            'firstname': employee.firstname,
            'lastname': employee.lastname,
            'dateOfBirth': employee.dateOfBirth.isoformat(),  # Convert to ISO format for JSON serialization
            'gender': employee.gender,
            'contact': employee.contact,
            'identification_number': employee.identification_number,
            'department_number': employee.department_number,
            'dateOfEmployment': employee.dateOfEmployment.isoformat(),  # Convert to ISO format for JSON serialization
            'contractPeriod': employee.contractPeriod,
            'job': employee.job,
            'documents': []  
        }

        # Populate the documents list with document details
        for document in documents:
            document_data = {
                'id': document.id,
                'passport_filepath': document.passport_filepath,
                'IdCopy_filepath': document.IdCopy_filepath,
                'ChiefLetter_filepath': document.ChiefLetter_filepath,
                'ClearanceLetter_filepath': document.ClearanceLetter_filepath,
                'Reference_filepath': document.Reference_filepath
            
            }
            employee_data['documents'].append(document_data)

        return jsonify({'status': 'success', 'employee': employee_data}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)