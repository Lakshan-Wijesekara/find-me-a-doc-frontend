import axios from 'axios';

// Interface for backend call
export interface LoginRequest {
    email: string;
    password: string;
}

// Response interface from backend
export interface LoginResponse {
    email: string;
    token: string;
    userID: number;
    role: string;
}

export interface DoctorRegisterRequest {
    email: string;
    password: string;
    name: string;
    specialization: string;
    consultationFee: number;
    phoneNumber: string;
}

export interface DoctorRegisterResponse {
    doctorId: number;
    email: string;
    name: string;
    specialization: string;
    consultationFee: number;
}

export interface PatientRegisterRequest {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    age: number;
}

export interface PatientRegisterResponse {
    userId: number;
    email: string;
    name: string;
    age: number;
}

const AUTH_API_URL = "http://localhost:8080/api/v1/auth";

// API call
export const loginUser = async(credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
        `${AUTH_API_URL}/login`,
        credentials,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return response.data;
}

// The API call for signing up of a doctor
export const registerDoctor = async (userData: DoctorRegisterRequest): Promise<DoctorRegisterResponse> => {
    const response = await axios.post<DoctorRegisterResponse>(
        `${AUTH_API_URL}/register/doctor`,
        userData,
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    return response.data;
}

// The API call for signing up of a doctor
export const registerPatient = async (patientData: PatientRegisterRequest): Promise<PatientRegisterResponse> => {
    const response = await axios.post<PatientRegisterResponse>(
        `${AUTH_API_URL}/register/patient`,
        patientData,
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    return response.data;
}