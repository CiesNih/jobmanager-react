import { useState } from 'react';
import { getAllCandidates, getCandidateById, getHoSos, getDonUngTuyens } from '../services/candidateService';

export default function TestAPI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [id, setId] = useState('');
  const [tab, setTab] = useState('all');

  const handleGetAll = async () => {
    setTab('all');
    setLoading(true);
    setError(null);
    try {
      const result = await getAllCandidates();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async () => {
    if (!id) {
      setError('Vui lòng nhập ID');
      return;
    }
    setTab('byId');
    setLoading(true);
    setError(null);
    try {
      const result = await getCandidateById(id);
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetHoSos = async () => {
    if (!id) {
      setError('Vui lòng nhập ID');
      return;
    }
    setTab('hoSos');
    setLoading(true);
    setError(null);
    try {
      const result = await getHoSos(id);
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDonUngTuyens = async () => {
    if (!id) {
      setError('Vui lòng nhập ID');
      return;
    }
    setTab('donTuyens');
    setLoading(true);
    setError(null);
    try {
      const result = await getDonUngTuyens(id);
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Test API UngVienAPI</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <button onClick={handleGetAll} style={{ marginRight: '10px' }}>Get All UngVien</button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="Nhập MaUngVien (GUID)" 
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleGetById} style={{ marginRight: '10px' }}>Get By ID</button>
        <button onClick={handleGetHoSos} style={{ marginRight: '10px' }}>Get HoSos</button>
        <button onClick={handleGetDonUngTuyens}>Get DonUngTuyens</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
      {data && (
        <div>
          <p style={{ color: 'green' }}>✅ Success</p>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
