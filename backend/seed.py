from app import db, Employee, Assignment, app
import os
from datetime import datetime
from faker import Faker

fake = Faker()

def create_fake_assignment(count=6):
    with app.app_context():
        assignments_data = [
            {'name': 'Guard', 'number': 1},
            {'name': 'Garage', 'number': 2},
            {'name': 'Customer Care', 'number': 3},
            {'name': 'Sales', 'number': 4},
            {'name': 'Human Resource', 'number': 5},
            {'name': 'Finance', 'number': 6},
        ]

        for assignment_data in assignments_data:
            assignment = Assignment(
                departmentnumber=assignment_data ['number'],
                departmentName=assignment_data ['name'],
                departmentHead=fake.name(),
                Location=fake.city()
            )
            db.session.add(assignment)
        
        db.session.commit()
    

def create_fake_employee(count=20):
    with app.app_context():
        assignment_numbers = [1, 2, 3, 4, 5, 6]

        for _ in range(count):
            firstname = fake.first_name()
            lastname = fake.last_name()

            # Generate file paths
            passport_filepath = os.path.join('path', 'to', 'passport', 'file')
            IdCopy_filepath = os.path.join('path', 'to', 'IdCopy', 'file')
            ChiefLetter_filepath = os.path.join('path', 'to', 'ChiefLetter', 'file')
            ClearanceLetter_filepath = os.path.join('path', 'to', 'ClearanceLetter', 'file')
            Reference_filepath = os.path.join('path', 'to', 'Reference', 'file')

            employee = Employee(
                firstname=firstname,
                lastname=lastname,
                dateOfBirth=fake.date(),
                gender=fake.random_element(elements=('Male', 'Female')),
                contact=fake.unique.random_number(10),
                IdentificationNumber=fake.random_number(digits=10),
                departmentnumber=fake.random_element(elements=assignment_numbers),
                dateOfEmployment=fake.date_time(),
                contractPeriod=fake.random_number(digits=2),
                job=fake.job(),
                passport_filepath=passport_filepath,
                IdCopy_filepath=IdCopy_filepath,
                ChiefLetter_filepath=ChiefLetter_filepath,
                ClearanceLetter_filepath=ClearanceLetter_filepath,
                Reference_filepath=Reference_filepath
            )
            db.session.add(employee)
        
        db.session.commit()

if __name__ == "__main__":
    create_fake_assignment()
    create_fake_employee()
    print("Seeding completed successfully.")
