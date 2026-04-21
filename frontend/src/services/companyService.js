import axios from 'axios';

const API_BASE = 'https://localhost:7272/api';
const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

export const getAllCompanies = async () => {
  const res = await api.get('/CongTy');
  return res.data;
};

export default { getAllCompanies };