import {useState, useEffect} from "react";

interface Doctor {
    id: number;
    name: string; // Match your DTO field names!
    specialization: string;
    consultationFee: number;
}

function Marketplace() {
    // Create a state variable doctor
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');

    // Worker hook runs once when the page loads
    useEffect(() => {
        const baseUrl = "http://localhost:8080/api/v1/doctors";
        const url = selectedSpecialty
            ? `${baseUrl}?specialty=${selectedSpecialty}`
            : baseUrl;

        fetch(url)
            .then(response => response.json())
            .then(data => setDoctors(data));
    }, [selectedSpecialty]); // The dependency array ensures this runs when selectedSpecialty changes

    // The UI return to the screen
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Find a Doctor</h1>

            <div style={{ marginBottom: '20px' }}>
                <label>Specialty: </label>
                <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px' }}
                >
                    <option value="">All Specialties</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Medicine">General Medicine</option>
                </select>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                {doctors.length > 0 ? (
                    doctors.map(doctor => (
                        <div key={doctor.id} style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: '2px 2px 5px rgba(0,0,0,0.05)'
                        }}>
                            {/* 2. Using .name here to match your DTO */}
                            <h3 style={{ margin: '0 0 5px 0' }}>Dr. {doctor.name}</h3>
                            <p style={{ margin: '5px 0', color: '#555' }}>
                                <strong>Specialty:</strong> {doctor.specialization}
                            </p>
                            <p style={{ margin: '5px 0', color: '#007bff', fontWeight: 'bold' }}>
                                Consultation Fee: ${doctor.consultationFee}
                            </p>
                            <button style={{
                                marginTop: '10px',
                                padding: '8px 12px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Book Appointment
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No doctors found for this specialty.</p>
                )}
            </div>
        </div>
    );
}

export default Marketplace;