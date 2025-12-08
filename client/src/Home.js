import React from 'react'
import { useNavigate } from 'react-router-dom'

export function Home() {
    const navigate = useNavigate()

    const views = [
        { name: 'Room Wise View', path: '/room_wise_view' },
        { name: 'Symptoms Overview View', path: '/symptoms_overview_view' },
        { name: 'Medical Staff View', path: '/medical_staff_view' },
        { name: 'Department View', path: '/department_view' },
        { name: 'Outstanding Charges View', path: '/outstanding_charges_view' }
    ]

    const storedProcedures = [
        { name: 'Add Patient', path: '/add_patient' },
        { name: 'Record Symptom', path: '/record_symptom' },
        { name: 'Book Appointment', path: '/book_appointment' },
        { name: 'Place Order', path: '/place_order' },
        { name: 'Add Staff to Department', path: '/add_staff_to_dept' },
        { name: 'Add Funds', path: '/add_funds' },
        { name: 'Assign Nurse to Room', path: '/assign_nurse_to_room' },
        { name: 'Assign Room to Patient', path: '/assign_room_to_patient' },
        { name: 'Assign Doctor to Appointment', path: '/assign_doctor_to_appointment' },
        { name: 'Manage Department', path: '/manage_department' },
        { name: 'Release Room', path: '/release_room' },
        { name: 'Remove Patient', path: '/remove_patient' },
        { name: 'Remove Staff', path: '/remove_staff' },
        { name: 'Remove Staff from Department', path: '/remove_staff_from_dept' },
        { name: 'Complete Appointment', path: '/complete_appointment' },
        { name: 'Complete Orders', path: '/complete_orders' }
    ]

    return (
        <div style={{ padding: "40px", fontFamily: "Arial" }}>
            <h1 style={{ marginBottom: "30px" }}>Hospital Management System</h1>
            
            <div style={{ marginBottom: "40px" }}>
                <h2 style={{ marginBottom: "20px" }}>Views</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {views.map((view, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(view.path)}
                            style={{
                                padding: "10px 20px",
                                fontSize: "14px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "4px"
                            }}
                        >
                            {view.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h2 style={{ marginBottom: "20px" }}>Stored Procedures</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {storedProcedures.map((sp, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(sp.path)}
                            style={{
                                padding: "10px 20px",
                                fontSize: "14px",
                                backgroundColor: "#2196F3",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "4px"
                            }}
                        >
                            {sp.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
