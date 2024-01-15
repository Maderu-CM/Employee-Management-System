from flask import jsonify, request
from app import db, Employee, Department, app
from flask_cors import CORS


from datetime import datetime


CORS(app)




app.config['JWT_SECRET_KEY'] = 'kjsfhiuyrnAUTdjhddjlkjfeadDAlHgDM'


# Adding an employee
@app.route('/add_employee', methods=['POST'])
def add_employee():
    try:
        data = request.get_json()

        # Extract data from the JSON payload
        firstname = data.get('firstname')
        midint = data.get('midint')  
        lastname = data.get('lastname')
        gender = data.get('gender')
        contact = data.get('contact')
        departmentnumber = data.get('departmentnumber')
        hiredate_str = data.get('hiredate')
        educationlevel = data.get('educationlevel')
        job = data.get('job')
        salary = data.get('salary')
        bonus = data.get('bonus')
        commission = data.get('commission')

        # Convert hiredate string to datetime
        hiredate = datetime.fromisoformat(hiredate_str)

        # Create a new Employee instance
        new_employee = Employee(
            firstname=firstname,
            midint=midint,
            lastname=lastname,
            gender=gender,
            contact=contact,
            departmentnumber=departmentnumber,
            hiredate=hiredate,
            educationlevel=educationlevel,
            job=job,
            salary=salary,
            bonus=bonus,
            commission=commission
        )

        # Add the new employee to the database
        db.session.add(new_employee)
        db.session.commit()

        return jsonify({'message': 'New Employee added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Add a department
@app.route('/add_department', methods=['POST'])
def add_department():
    try:
        data = request.get_json()

        # Extract data from the JSON payload
        departmentName= data.get('departmentName')
        departmentHead = data.get('departmentHead')  
        Location = data.get('Location')

        

        # Create a new Department instance
        new_department= Department(
            departmentName=departmentName,
            departmentHead=departmentHead,
            Location=Location
          
        )

        # Add the new employee to the database
        db.session.add(new_department)
        db.session.commit()

        return jsonify({'message': 'New Department added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500





if __name__ == '__main__':
    app.run(debug=True)