import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const login = (data) => API.post('/auth/login', data);
export const fetchMe = () => API.get('/auth/me');
export const register = (data) => API.post('/auth/register', data);

export const fetchPatients = () => API.get('/patients/');
export const addPatient = (data) => API.post('/patients/create', data);
export const getPatientById = (id) => API.get(`/patients/${id}`);
export const updatePatient = (patient) => API.put(`/patients/update/${patient._id}`, patient);
export const deletePatient = (id) => API.delete(`/patients/delete/${id}`);

export const fetchDoctors = () => API.get('/doctors/');
export const getDoctorById = (id) => API.get(`/doctors/${id}`);
export const addDoctor = (data) => API.post('/doctors/create', data);
export const deleteDoctor = (id) => API.delete(`/doctors/delete/${id}`);
export const updateDoctor = (doctor) => API.put(`/doctors/update/${doctor._id}`, doctor);

// Admin
export const fetchAppointments = (date) => 
    API.get(`/appointments?date=${date}`);

// Doctor
export const fetchMyTodayAppointments = () => 
    API.get('/appointments/my-today');

export const addAppointment = (data) => API.post('/appointments/create', data);
export const deleteAppointment = (id) => API.delete(`/appointments/delete/${id}`);
export const updateAppointmentStatus = (id, status) => 
    API.patch(`/appointments/${id}/status`, { status });
