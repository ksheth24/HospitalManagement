import React, { useState, useEffect } from 'react'
import "../formatting/RoomWiseView.css"

export function RoomWiseView() {
    const [column, setColumn] = useState([])
    const [records, setRecords] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:5000/views/room_wise_view").then(
      res => res.json()
    ).then(data => {
        const columns = [
          "patient_fname",
          "patient_lname",
          "room_num",
          "department_name",
          "doctor_fname",
          "doctor_lname",
          "nurse_fname",
          "nurse_lname"
        ];
        setColumn(columns);
        setRecords(data);
      });
  }, []);

  return (
    <div>
        <table className='room_wise_view'>
          <thead>
            <tr>
              {column.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {records.map((record, i) => (
                <tr key={i}>
                  <td>{record[0]}</td>
                  <td>{record[1]}</td>
                  <td>{record[2]}</td>
                  <td>{record[3]}</td>
                  <td>{record[4]}</td>
                  <td>{record[5]}</td>
                  <td>{record[6]}</td>
                  <td>{record[7]}</td>
                </tr>
              ))}
          </tbody>
        </table>
    </div>
  )
}