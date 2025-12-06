import React, { useState, useEffect } from 'react'
import "../formatting/MedicalStaffView.css"

export function MedicalStaffView() {
    const [column, setColumn] = useState([])
    const [records, setRecords] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:5000/views/medical_staff_view").then(
      res => res.json()
    ).then(data => {
        const columns = [
          "staffSsn",
          "staffType",
          "licenseInfo",
          "jobInfo",
          "deptNames",
        ];
        setColumn(columns);
        setRecords(data);
      });
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
        <table className='medical_staff_view'>
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
                </tr>
              ))}
          </tbody>
        </table>
    </div>
  )
}