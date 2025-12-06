import React, { useState, useEffect } from 'react'
import "../formatting/OutstandingChargesView.css"

export function OutstandingChargesView() {
    const [column, setColumn] = useState([])
    const [records, setRecords] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:5000/views/outstanding_charges_view").then(
      res => res.json()
    ).then(data => {
        const columns = [
          "fname",
          "lname",
          "ssn", 
          "funds", 
          "outstanding_costs",
          "appt_count",
          "order_count",
        ];
        setColumn(columns);
        setRecords(data);
      });
  }, []);

  return (
    <div>
        <table className='outstanding_charges_view'>
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
                </tr>
              ))}
          </tbody>
        </table>
    </div>
  )
}