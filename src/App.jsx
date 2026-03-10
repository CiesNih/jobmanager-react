import { useEffect, useState } from 'react';
import { getAllCandidates } from './services/candidateService';
import TestAPI from './pages/TestAPI';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching from:', 'https://localhost:7122/api/UngVien');
    getAllCandidates()
      .then(res => {
        console.log('✅ API Response:', res.data);
        setCandidates(res.data);
      })
      .catch(err => {
        console.error('❌ Error:', err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Danh sách ứng viên từ API</h1>
      {candidates.length === 0 ? (
        <p>Không có dữ liệu</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tiêu đề hồ sơ</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Địa chỉ</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Kinh nghiệm</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(item => (
              <tr key={item.maUngVien}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.tieuDeHoSo || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.diaChi || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.soNamKinhNghiem || 0} năm</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <hr />
      <TestAPI />
    </div>
  );
}

export default App;
