import React, { useState, useEffect } from 'react'

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
          "numAssignments",
        ];
        setColumn(columns);
        setRecords(data);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
        <table style={{borderCollapse: "collapse", width: "100%", fontFamily: "Arial", fontSize: "14px", border: "1px solid #ccc"}}>
          <thead>
            <tr>
              {column.map((c, i) => (
                <th key={i} style={{backgroundColor: "#f0f0f0", padding: "8px", textAlign: "left", border: "1px solid #ccc"}}>{c}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {records.map((record, i) => (
                <tr key={i} style={{backgroundColor: i % 2 === 0 ? "#e6f3ff" : "white"}}>
                  <td style={{padding: "8px", border: "1px solid #ccc"}}>{record[0]}</td>
                  <td style={{padding: "8px", border: "1px solid #ccc"}}>{record[1]}</td>
                  <td style={{padding: "8px", border: "1px solid #ccc"}}>{record[2]}</td>
                  <td style={{padding: "8px", border: "1px solid #ccc"}}>{record[3]}</td>
                  <td style={{padding: "8px", border: "1px solid #ccc"}}>{record[4]}</td>
                  <td style={{padding: "8px", border: "1px solid #ccc"}}>{record[5]}</td>
                </tr>
              ))}
          </tbody>
        </table>
    </div>
  )
}