import axios from 'axios';

const API_URL = "https://localhost:xxxx/api/candidates"; // Thay xxxx bằng port của bạn

export const getAllCandidates = () => axios.get(API_URL);
export const createCandidate = (data) => axios.post(API_URL, data);

import { useEffect, useState } from 'react'
import { getAllCandidates } from './services/candidateService'

function App() {
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    getAllCandidates()
      .then(res => setCandidates(res.data))
      .catch(err => console.error("Lỗi rồi: ", err))
  }, [])

  return (
    <div>
      <h1>Danh sách ứng viên từ API</h1>
      <ul>
        {candidates.map(item => (
          <li key={item.id}>{item.fullName}</li>
        ))}
      </ul>
    </div>
  )
}