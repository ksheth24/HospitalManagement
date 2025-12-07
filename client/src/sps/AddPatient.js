import React from 'react'

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
                setSsn('');
                setFirstName('');
                setLastName('');
                setDob('');
                setAddress('');
                setFunds('');
                setContact('');
            } else {
                const errorText = await response.text();
                alert("Error: " + errorText);
            }
        }
        catch (error) {
            alert("Error adding patient: " + error.message)
        }
    };

    const cancel = () => {
        setSsn('');
        setFirstName('');
        setLastName('');
        setDob('');
        setAddress('');
        setFunds('');
        setContact('');
    };

    return (
        <div style={{padding: "20px"}}>
            <h2 style={{margin: "0 0 20px 0", fontSize: "18px"}}>add_patient()</h2>
            <div style={{display: "flex", gap: "20px", marginBottom: "20px"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                    <div>
                        <div style={{backgroundColor: "#666", color: "white", padding: "5px 8px", fontSize: "12px"}}>ssn</div>
                        <input 
                            type="text" 
                            style={{backgroundColor: "#e0e0e0", border: "none", padding: "8px", fontSize: "14px", width: "200px"}}
                            value={ssn}
                            onChange={(e) => setSsn(e.target.value)}
                        />
                    </div>
                    <div>
                        <div style={{backgroundColor: "#666", color: "white", padding: "5px 8px", fontSize: "12px"}}>Birthdate</div>
                        <input 
                            type="text" 
                            style={{backgroundColor: "#e0e0e0", border: "none", padding: "8px", fontSize: "14px", width: "200px"}}
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                    </div>
                    <div>
                        <div style={{backgroundColor: "#666", color: "white", padding: "5px 8px", fontSize: "12px"}}>Contact</div>
                        <input 
                            type="text" 
                            style={{backgroundColor: "#e0e0e0", border: "none", padding: "8px", fontSize: "14px", width: "200px"}}
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                    <div>
                        <div style={{backgroundColor: "#666", color: "white", padding: "5px 8px", fontSize: "12px"}}>First Name</div>
                        <input 
                            type="text" 
                            style={{backgroundColor: "#e0e0e0", border: "none", padding: "8px", fontSize: "14px", width: "200px"}}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div>
                        <div style={{backgroundColor: "#666", color: "white", padding: "5px 8px", fontSize: "12px"}}>Address</div>
                        <input 
                            type="text" 
                            style={{backgroundColor: "#e0e0e0", border: "none", padding: "8px", fontSize: "14px", width: "200px"}}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                    <div>
                        <div style={{backgroundColor: "#666", color: "white", padding: "5px 8px", fontSize: "12px"}}>Last Name</div>
                        <input 
                            type="text" 
                            style={{backgroundColor: "#e0e0e0", border: "none", padding: "8px", fontSize: "14px", width: "200px"}}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div>
                        <div style={{backgroundColor: "#666", color: "white", padding: "5px 8px", fontSize: "12px"}}>Funds</div>
                        <input 
                            type="text" 
                            style={{backgroundColor: "#e0e0e0", border: "none", padding: "8px", fontSize: "14px", width: "200px"}}
                            value={funds}
                            onChange={(e) => setFunds(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div style={{display: "flex", gap: "10px", marginTop: "20px"}}>
                <button style={{padding: "10px 30px", border: "none", backgroundColor: "#555", color: "white", cursor: "pointer", fontSize: "14px"}} onClick={cancel}>Cancel</button>
                <button style={{padding: "10px 30px", border: "none", backgroundColor: "#555", color: "white", cursor: "pointer", fontSize: "14px"}} onClick={submit}>Add</button>
            </div>
        </div>
    )
}