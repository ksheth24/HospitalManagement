import React, { useState, useEffect } from 'react'
import "../formatting/DepartmentView.css"

export function DepartmentView() {
    const [column, setColumn] = useState([])
    const [records, setRecords] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:5000/views/department_view").then(
      res => res.json()
    ).then(data => {
        const columns = [
          "department_name",
          "num_staff",
          "num_doctors",
          "num_nurses",
        ];
        setColumn(columns);
        setRecords(data);
      });
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
        <table className='department_view'>
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
                </tr>
              ))}
          </tbody>
        </table>
    </div>
  )
}