import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

export function Home() {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')

    const views = [
        { name: 'Room Wise View', path: '/room_wise_view', desc: 'See occupancy per room and assigned staff.' },
        { name: 'Symptoms Overview View', path: '/symptoms_overview_view', desc: 'Quick summary of reported symptoms.' },
        { name: 'Medical Staff View', path: '/medical_staff_view', desc: 'Browse doctors, nurses and staff details.' },
        { name: 'Department View', path: '/department_view', desc: 'Department info and head counts.' },
        { name: 'Outstanding Charges View', path: '/outstanding_charges_view', desc: 'Unpaid bills and balances.' }
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

    const q = query.trim().toLowerCase()
    const filteredViews = useMemo(() => views.filter(v => v.name.toLowerCase().includes(q) || v.desc.toLowerCase().includes(q)), [q])
    const filteredSPs = useMemo(() => storedProcedures.filter(s => s.name.toLowerCase().includes(q)), [q])

    return (
        <main className="hm-container">
            <header className="hm-hero">
                <div className="hm-hero-inner">
                    <h1 className="hm-title">Hospital Management System</h1>
                    <p className="hm-sub">Monitor rooms, staff, appointments and billing — all from a single dashboard.</p>
                    <div className="hm-cta">
                        <button className="btn primary" onClick={() => navigate('/room_wise_view')}>Open Dashboard</button>
                        <button className="btn ghost" onClick={() => navigate('/department_view')}>Departments</button>
                    </div>
                </div>
            </header>

            <section className="hm-section">
                <div style={{display:'flex', alignItems:'center', gap:12, justifyContent:'space-between'}}>
                    <h2 className="section-title">Views & Stored Procedures</h2>
                    <input className="search" placeholder="Search views or procedures..." value={query} onChange={e=>setQuery(e.target.value)} />
                </div>

                <div style={{marginTop:16}}>
                    <div className="card-grid">
                        {filteredViews.map((v,i) => (
                            <article key={i} className="card" onClick={() => navigate(v.path)} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') navigate(v.path)}}>
                                <div className="card-icon">📊</div>
                                <h3 className="card-title">{v.name}</h3>
                                <p className="card-desc">{v.desc}</p>
                                <div className="card-action"><button className="btn small" onClick={(e)=>{e.stopPropagation(); navigate(v.path)}}>Open</button></div>
                            </article>
                        ))}
                    </div>

                    <div style={{marginTop:20}}>
                        <div className="card" style={{padding:'16px'}}>
                            <h3 style={{margin:'0 0 8px 0'}}>Stored Procedures</h3>
                            <p style={{margin:0, color:'var(--muted)'}}>Click a procedure to open its form or invoke it.</p>
                            <div className="sp-grid" style={{marginTop:12}}>
                                {filteredSPs.map((sp,i) => (
                                    <button key={i} className="sp-pill" onClick={() => navigate(sp.path)}>{sp.name}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}