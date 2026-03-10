const API_URL = 'https://localhost:7122/api';

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

export const getUngVien = () => apiCall('/UngVien');
export const getUngVienById = (id) => apiCall(`/UngVien/${id}`);
export const createUngVien = (data) => apiCall('/UngVien', 'POST', data);
