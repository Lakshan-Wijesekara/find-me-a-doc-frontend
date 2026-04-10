import React, {useState, useEffect} from "react";

function Marketplace() {
    // Create a state variable doctor
    const [doctors, setDoctors] = useState([]);

    // Worker hook runs once when the page loads
    useEffect(() => {
      fetch("/api/v1/doctors")
            .then(response => response.json())
            .then(data => setDoctors(data));
    }, []);

    // The UI return to the screen
    return (
        <div>
            <h1>Doctor Marketplace</h1>
            <ul>
                <li>
                    {doctors.map(doctor => <li> {doctor.name} </li>)}
                </li>
            </ul>
            <p>Number of doctors loaded: {doctors.length}</p>
        </div>
    );
}

export default Marketplace;