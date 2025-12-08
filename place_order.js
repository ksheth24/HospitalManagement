import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function PlaceOrder() {
    const [order, setOrder] = React.useState('');
    const [priority, setPriority] = React.useState('');
    const [patient, setPatient] = React.useState('');
    const [doctor, setDoctor] = React.useState('');
    const [cost, setCost] = React.useState('');
    const [labtype, setLabtype] = React.useState('');
    const [drug, setDrug] = React.useState('');
    const [dosage, setDosage] = React.useState('');

    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/record_symptom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_orderNumber: order,
                    ip_priority: priority,
                    ip_patientId: patient,
                    ip_doctorId: doctor,
                    ip_cost: cost,
                    ip_labType: labtype,
                    ip_drug: drug,
                    ip_dosage: dosage
                })
            });
            if (response.ok) {
                alert("Order has been placed successfully!");
            }
        }
        catch (error) {
            alert("")
        }
    };

    return (
        <div style = {{display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px'}}>
            <TextField
                label = "Order Number"
                value = {order}
                onChange = {(e) => setOrder(e.target.value)}
            />

            <TextField
                label = "Priority"
                value = {priority}
                onChange = {(e) => setPriority(e.target.value)}
            />

            <TextField
                label = "PatientId"
                value = {patient}
                onChange = {(e) => setPatient(e.target.value)}
            />

            <TextField
                label = "DoctorId"
                value = {doctor}
                onChange = {(e) => setDoctor(e.target.value)}
            />

            <TextField
                label = "Cost"
                value = {cost}
                onChange = {(e) => setCost(e.target.value)}
            />

            <TextField
                label = "Lab Type"
                value = {labtype}
                onChange = {(e) => setLabtype(e.target.value)}
            />

            <TextField
                label = "Drug"
                value = {drug}
                onChange = {(e) => setDrug(e.target.value)}
            />

            <Button 
                variant="outlined"
                onClick = {submit}>
                Send
            </Button>


        </div>

        
    )
}