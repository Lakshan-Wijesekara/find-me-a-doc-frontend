import {useState, useEffect} from "react";
import { BookingModal } from "@/components/BookingModel.tsx";

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

    // Add state to track the selected doctor for booking
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

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
        <div className="container mx-auto p-6 md:p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Find a Doctor</h1>
                    <p className="text-muted-foreground mt-1">Book your next consultation easily.</p>
                </div>

                {/* Filter Dropdown */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground whitespace-nowrap">
                        Specialty:
                    </label>
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="flex h-10 w-full md:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">All Specialties</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="General Medicine">General Medicine</option>
                    </select>
                </div>
            </div>

            {/* Doctor Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {doctors.length > 0 ? (
                    doctors.map(doctor => (
                        <div
                            key={doctor.id}
                            className="flex flex-col rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold tracking-tight">Dr. {doctor.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {doctor.specialization}
                                </p>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Fee: </span>
                                    <span className="font-medium text-foreground">${doctor.consultationFee}</span>
                                </div>

                                <button
                                    onClick={() => setSelectedDoctor(doctor)}
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    Book
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
                        <p className="text-muted-foreground">No doctors found for this specialty.</p>
                    </div>
                )}
            </div>

            <BookingModal
                isOpen={selectedDoctor !== null}
                onClose={() => setSelectedDoctor(null)}
                doctorId={selectedDoctor?.id || 0}
                doctorName={`Dr. ${selectedDoctor?.name || ''}`}
            />
        </div>
    );
}

export default Marketplace;