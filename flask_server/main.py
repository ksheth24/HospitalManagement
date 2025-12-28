from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
from datetime import timedelta, datetime
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_connection(): 
    return mysql.connector.connect(
        host = os.getenv("DB_HOST"),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME")
    )

# @app.route('/getTable', methods=['GET'])
# def get_table():
#     cursor = connection.cursor()
#     cursor.execute("SHOW TABLES;")
#     # Saves the result of the executed query into tables 
#     tables = cursor.fetchall()
#     cursor.close()
#     connection.close()
#     table_names = [table[0] for table in tables]
#     return jsonify({"tables": table_names}), 200

@app.route('/views/room_wise_view', methods=['GET'])
def get_room_wise_view():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM room_wise_view;")
    # Saves the result of the executed query into tables 
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(rows), 200

@app.route('/views/symptoms_overview_view', methods=['GET'])
def get_symptoms_overview_view():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM symptoms_overview_view;")
    # Saves the result of the executed query into tables 
    rows = cursor.fetchall()
    def convert(o):
        if isinstance(o, timedelta):
            return str(o)
        return o

    rows = [tuple(convert(x) for x in row) for row in rows]
    cursor.close()
    connection.close()

    return jsonify(rows), 200

@app.route('/views/medical_staff_view', methods=['GET'])
def get_medical_staff_view():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM medical_staff_view;")
    # Saves the result of the executed query into tables 
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(rows), 200

@app.route('/views/department_view', methods=['GET'])
def get_department_view():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM department_view")
    # Saves the result of the executed query into tables 
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(rows), 200

@app.route('/views/outstanding_charges_view', methods=['GET'])
def get_outstanding_charges_view():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM outstanding_charges_view")
    # Saves the result of the executed query into tables 
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(rows), 200

@app.route('/sp/add_patient', methods=['POST'])
def add_patient():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("add_patient", (data["ip_ssn"], data["ip_first_name"], data["ip_last_name"], data["ip_birthdate"], data["ip_address"], data["ip_funds"], data["ip_contact"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/record_symptom', methods=['POST'])
def record_symptom():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("record_symptom", (data["ip_patientId"], data["ip_numDays"], data["ip_apptDate"], data["ip_apptTime"], data["ip_symptomType"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/book_appointment', methods=['POST'])
def book_appointment():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("book_appointment", (data["ip_patientId"], data["ip_apptDate"], data["ip_apptTime"], data["ip_apptCost"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/place_order', methods=['POST'])
def place_order():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("place_order", (data["ip_orderNumber"], data["ip_priority"], data["ip_patientId"], data["ip_doctorId"], data["ip_cost"], data["ip_labType"], data["ip_drug"], data["ip_dosage"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/add_staff_to_dept', methods=['POST'])
def add_staff_to_dept():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("add_staff_to_dept", (data["ip_deptId"], data["ip_ssn"], data["ip_firstName"], data["ip_lastName"], data["ip_birthdate"], data["ip_startdate"], data["ip_address"], data["ip_staffId"], data["ip_salary"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/add_funds', methods=['POST'])
def add_funds():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("add_funds", (data["ip_ssn"], data["ip_funds"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/assign_nurse_to_room', methods=['POST'])
def assign_nurse_to_room():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("assign_nurse_to_room", (data["ip_nurseId"], data["ip_roomNumber"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/assign_room_to_patient', methods=['POST'])
def assign_room_to_patient():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("assign_room_to_patient", (data["ip_ssn"], data["ip_roomNumber"], data["ip_roomType"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/assign_doctor_to_appointment', methods=['POST'])
def assign_doctor_to_appointment():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("assign_doctor_to_appointment", (data["ip_patientId"], data["ip_apptDate"], data["ip_apptTime"], data["ip_doctorId"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/manage_department', methods=['POST'])
def manage_department():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("manage_department", (data["ip_ssn"], data["ip_deptId"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/release_room', methods=['POST'])
def release_room():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("release_room", (data["ip_roomNumber"],))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/remove_patient', methods=['POST'])
def remove_patient():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("remove_patient", (data["ip_ssn"],))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/remove_staff', methods=['POST'])
def remove_staff():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("remove_staff", (data["ip_ssn"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200


@app.route('/sp/remove_staff_from_dept', methods=['POST'])
def remove_staff_from_dept():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("remove_staff_from_dept", (data["ip_ssn"], data["ip_deptId"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/complete_appointment', methods=['POST'])
def complete_appointment():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("complete_appointment", (data["ip_patientId"], data["ip_apptDate"], data["ip_apptTime"]))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

@app.route('/sp/complete_orders', methods=['POST'])
def complete_orders():
    data = request.get_json()
    connection = get_connection()
    cursor = connection.cursor()
    cursor.callproc("complete_orders", (data["ip_num_orders"],))
    connection.commit()
    cursor.close()
    connection.close()
    return "OK", 200

if __name__ == '__main__':
    print("connecting")
    app.run(debug=True)