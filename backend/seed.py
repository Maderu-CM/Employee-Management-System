from app import db, Employee, Assignment, Document,app

from faker import Faker

fake = Faker()

def create_fake_assignment(count=6):
    with app.app_context():
        assignments_data = [
            {'name': 'Guard', 'number': 1},
            {'name': 'Garage', 'number': 2},
            {'name': 'Customer Care', 'number': 3},
            {'name': 'Sales', 'number': 4},
            {'name': 'Hygiene and Sanitation', 'number': 5},
            {'name': 'Finance', 'number': 6},
        ]

        for assignment_data in assignments_data:
            assignment = Assignment(
                departmentnumber=assignment_data['number'],
                departmentName=assignment_data['name'],
                departmentHead=fake.name(),
                Location=fake.city()
            )
            db.session.add(assignment)
        
        db.session.commit()
    
def upload_file(filename):
    # For demonstration, print the filename
    print(f"Uploading file: {filename}")

def create_fake_employee(count=15):
    with app.app_context():
        department_numbers = [1, 2, 3, 4, 5]

        for _ in range(count):
            firstname = fake.first_name()
            lastname = fake.last_name()
            identification_number = fake.unique.random_number(8)
            date_of_birth = fake.date_of_birth(minimum_age=18, maximum_age=65)
            contact = fake.unique.random_number(10)
            date_of_employment = fake.date_time_between(
                start_date='-5y', end_date='now')
            department_number = fake.random_element(elements=department_numbers)
            contract_period = fake.random_int(min=1, max=5)
            passport_filepath = f"{firstname}_{lastname}_passport.jpg"
            id_copy_filepath = f"{firstname}_{lastname}_id_copy.pdf"
            chief_letter_filepath = f"{firstname}_{lastname}_chief_letter.pdf"
            clearance_letter_filepath = f"{firstname}_{lastname}_clearance_letter.pdf"
            reference_filepath = f"{firstname}_{lastname}_referees.pdf"

            employee = Employee(
        firstname=firstname,
        lastname=lastname,
        dateOfBirth=date_of_birth,
        gender=fake.random_element(elements=('Male', 'Female')),
        contact=contact,
        identification_number=identification_number, 
        department_number=department_number, 
        dateOfEmployment=date_of_employment,
        contractPeriod=contract_period,
        job=fake.job(),
    )

            db.session.add(employee)
            db.session.commit()

            # Create Document instance and link to Employee
            document = Document(
                employee_id=employee.id,
                passport_filepath=passport_filepath,
                IdCopy_filepath=id_copy_filepath,
                ChiefLetter_filepath=chief_letter_filepath,
                ClearanceLetter_filepath=clearance_letter_filepath,
                Reference_filepath=reference_filepath
            )
            db.session.add(document)
            db.session.commit()

            # Upload documents
            upload_file(passport_filepath)
            upload_file(id_copy_filepath)
            upload_file(chief_letter_filepath)
            upload_file(clearance_letter_filepath)
            upload_file(reference_filepath)

if __name__ == "__main__":
    create_fake_assignment()
    create_fake_employee()
    print("Seeding completed successfully.")