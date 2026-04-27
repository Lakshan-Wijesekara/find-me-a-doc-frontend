import axios from 'axios';

export interface PatientProfile {
    id: number;
    name: string;
    email: string;
}

export const getPatientProfile = async (): Promise<PatientProfile> => {
    const token = localStorage.getItem("token");

    const response = await axios.get('http://localhost:8080/api/v1/patients/me', {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
};