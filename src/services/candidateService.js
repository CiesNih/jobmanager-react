import axios from 'axios';

const API_URL = "https://localhost:7122/api/UngVien"; 

const axiosInstance = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllCandidates = () => axiosInstance.get(API_URL);
export const getCandidateById = (id) => axiosInstance.get(`${API_URL}/${id}`);
export const createCandidate = (data) => axiosInstance.post(API_URL, data);
export const updateCandidate = (id, data) => axiosInstance.put(`${API_URL}/${id}`, data);
export const deleteCandidate = (id) => axiosInstance.delete(`${API_URL}/${id}`);
export const getHoSos = (id) => axiosInstance.get(`${API_URL}/${id}/HoSos`);
export const getDonUngTuyens = (id) => axiosInstance.get(`${API_URL}/${id}/DonUngTuyens`);