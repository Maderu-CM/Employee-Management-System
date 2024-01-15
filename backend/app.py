from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
from datetime import datetime


load_dotenv('.flaskenv')

app = Flask(__name__)

# Configuration for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)
CORS(app)

migrate = Migrate(app, db)

# Models
class Employee(db.Model):
    __tablename__ = 'employee'

    id = db.Column(db.Integer, nullable=False, unique=True, autoincrement=True, primary_key=True)
    firstname = db.Column(db.String(30), nullable=False)
    midint = db.Column(db.String(30), unique=True, nullable=False)
    lastname = db.Column(db.String(30), unique=True, nullable=False)
    gender = db.Column(db.String(30), nullable=False) 
    contact = db.Column(db.String(20), unique=True, nullable=False)
    departmentnumber = db.Column(db.String(20), db.ForeignKey('department.departmentnumber'), nullable=False)
    hiredate = db.Column(db.DateTime, nullable=False)
    educationlevel = db.Column(db.String, nullable=False)
    job = db.Column(db.String, nullable=False)
    salary = db.Column(db.Integer, nullable=False)
    bonus = db.Column(db.Integer, nullable=False)
    commission = db.Column(db.Integer, nullable=False)

    department = db.relationship('Department', backref=db.backref('employees', lazy=True))


class Department(db.Model):
    __tablename__ = 'department'

  
    departmentnumber = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    departmentName = db.Column(db.String, nullable=False)
    departmentHead = db.Column(db.String, nullable=False)
    Location = db.Column(db.String, nullable=False)



    



if __name__ == '__main__':
    app.run(debug=True)
