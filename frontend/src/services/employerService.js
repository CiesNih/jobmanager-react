import axios from 'axios';

const API_BASE_URL = 'https://localhost:7272/api/ntd';

// Lấy token từ localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ========================================================
// VIỆC LÀM
// ========================================================

// Lấy danh sách việc làm của công ty
export const getViecLamCuaCongTy = async (maCongTy, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vieclam`, {
      params: { maCongTy, ...params },
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Tạo việc làm mới
export const taoViecLam = async (data) => {
  try {
    const response = await axios.post('https://localhost:7272/api/ViecLam', data, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật việc làm
export const capNhatViecLam = async (id, data) => {
  try {
    const response = await axios.put(`https://localhost:7272/api/ViecLam/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Xóa việc làm
export const xoaViecLam = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:7272/api/ViecLam/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ========================================================
// ĐƠN ỨNG TUYỂN
// ========================================================

// Lấy danh sách đơn ứng tuyển
export const getDonUngTuyen = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/don-ung-tuyen`, {
      params,
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật trạng thái đơn ứng tuyển
export const capNhatTrangThaiDon = async (id, data) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/don-ung-tuyen/${id}/trang-thai`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ========================================================
// PHỎNG VẤN
// ========================================================

// Tạo lịch phỏng vấn
export const taoLichPhongVan = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/phong-van`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy chi tiết lịch phỏng vấn
export const getChiTietPhongVan = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/phong-van/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ========================================================
// THỐNG KÊ
// ========================================================

// Lấy thống kê
export const getThongKe = async (maCongTy) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/thong-ke`, {
      params: { maCongTy },
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ========================================================
// CÔNG TY
// ========================================================

// Lấy thông tin công ty
export const getThongTinCongTy = async (id) => {
  try {
    const response = await axios.get(`https://localhost:7272/api/CongTy/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật thông tin công ty
export const capNhatCongTy = async (id, data) => {
  try {
    const response = await axios.put(`http://localhost:7272/api/CongTy/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getViecLamCuaCongTy,
  taoViecLam,
  capNhatViecLam,
  xoaViecLam,
  getDonUngTuyen,
  capNhatTrangThaiDon,
  taoLichPhongVan,
  getChiTietPhongVan,
  getThongKe,
  getThongTinCongTy,
  capNhatCongTy
};
