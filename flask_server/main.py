from flask import Flask, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

connection = mysql.connector.connect(
    host = 'localhost',
    user = 'root',
    password = '7426',
    database = 'er_hospital_management'
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
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM room_wise_view;")
    # Saves the result of the executed query into tables 
    rows = cursor.fetchall()
    cursor.close()
    return jsonify(rows), 200

@app.route('/views/symptoms_overview_view', methods=['GET'])
def get_symptoms_overview_view():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM symptoms_overview_view;")
    # Saves the result of the executed query into tables 
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(rows), 200

@app.route('/views/medical_staff_view', methods=['GET'])
def get_medical_staff_view():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM medical_staff_view;")
    # Saves the result of the executed query into tables 
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(rows), 200

@app.route('/views/department_view', methods=['GET'])
def get_department_view():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM department_view")
    # Saves the result of the executed query into tables 
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(rows), 200

@app.route('/views/outstanding_charges_view', methods=['GET'])
def get_outstanding_charges_view():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM outstanding_charges_view")
    # Saves the result of the executed query into tables 
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(rows), 200

if __name__ == '__main__':
    print("connecting")
    app.run(debug=True)