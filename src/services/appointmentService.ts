import axios from 'axios';

// Define the TypeScript interfaces for the request and response data
export interface CreateAppointmentRequest {
    doctorId: number;
    appointmentDate: string; // Format: "YYYY-MM-DD"
    appointmentTime: string; // Format: "HH:mm:ss"
}

export interface CreateAppointmentResponse {
    doctorName: string;
    bookingId: string;
    appointmentDate: string;
    appointmentTime: string;
}

export interface AppointmentDashboardResponse {
    bookingId: string;
    doctorName: string;
    specialization: string;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
}

export interface DoctorAppointmentDashboardResponse {
    appointmentId: string;
    patientName: string;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
}

export interface AvailableSlotResponse {
    startTime: string; // Format: "HH:mm:ss"
    endTime: string;   // Format: "HH:mm:ss"
}

const API_BASE_URL = "http://localhost:8080/api/v1/appointments";

// Create the function to send the booking request
export const bookNewAppointment = async (requestData: CreateAppointmentRequest): Promise<CreateAppointmentResponse> => {

    // Retrieve the JWT token from local storage
    const token = localStorage.getItem("token");

    // Make the Axios POST request
    const response = await axios.post<CreateAppointmentResponse>(
        API_BASE_URL,
        requestData,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        }
    );

    return response.data;
}

// Get function
export const getPatientAppointments = async(): Promise<AppointmentDashboardResponse[]> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<AppointmentDashboardResponse[]>(
        API_BASE_URL,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
    );
    return response.data
}

//Fetch the dynamic slots for a specific doctor and date
export const getAvailableSlots = async(doctorId: number, date: string): Promise<AvailableSlotResponse[]> => {
    const token = localStorage.getItem("token");

    const response = await axios.get<AvailableSlotResponse[]>(
        `${API_BASE_URL}/available-slots`,
        {
            params: {
                doctorId: doctorId,
                date: date
            },
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
    );
    return response.data;
}

export const getDoctorAppointments = async (): Promise<DoctorAppointmentDashboardResponse[]> => {
    const token = localStorage.getItem("token");
    const response = await axios.get('http://localhost:8080/api/v1/appointments/doctor', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};