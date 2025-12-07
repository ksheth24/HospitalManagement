import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function AddPatient() {
    const [ssn, setSsn] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [dob, setDob] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [funds, setFunds] = React.useState('');
    const [contact, setContact] = React.useState('');

    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/add_patient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_ssn: ssn,
                    ip_first_name: firstName,
                    ip_last_name: lastName,
                    ip_birthdate: dob, 
                    ip_address: address,
                    ip_funds: funds, 
                    ip_contact: contact
                })
            });
            if (response.ok) {
                alert("Patient added successfully!");
            }
        }
        catch (error) {
            alert("")
        }
    };

    return (
        <div style = {{display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px'}}>
            <TextField
                label = "SSN"
                value = {ssn}
                onChange = {(e) => setSsn(e.target.value)}
            />

            <TextField
                label = "First Name"
                value = {firstName}
                onChange = {(e) => setFirstName(e.target.value)}
            />

            <TextField
                label = "Last Name"
                value = {lastName}
                onChange = {(e) => setLastName(e.target.value)}
            />

            <TextField
                label = "Birthdate"
                value = {dob}
                onChange = {(e) => setDob(e.target.value)}
            />

            <TextField
                label = "Address"
                value = {address}
                onChange = {(e) => setAddress(e.target.value)}
            />

            <TextField
                label = "Funds"
                value = {funds}
                onChange = {(e) => setFunds(e.target.value)}
            />

            <TextField
                label = "Contact"
                value = {contact}
                onChange = {(e) => setContact(e.target.value)}
            />

            <Button 
                variant="outlined"
                onClick = {submit}>
                Send
            </Button>


        </div>

        
    )
}