import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/doctors';

export interface DoctorProfile {
    id: number;
    name: string;
    email: string;
    specialization: string;
    phoneNumber: string;
    consultationFee: number;
}

export const getMyProfile = async (): Promise<DoctorProfile> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateMyProfile = async (data: Partial<DoctorProfile>): Promise<DoctorProfile> => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/me`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};