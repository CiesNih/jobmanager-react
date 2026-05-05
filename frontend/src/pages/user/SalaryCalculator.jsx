import React, { useState } from 'react';
import SalarySidebar from '../../components/SalarySidebar';
import '../../styles/SalaryCalculator.css';

// ==========================================
// 1. HẰNG SỐ CHUẨN LUẬT (Áp dụng từ 01/07/2024)
// ==========================================
const PERSONAL_DEDUCTION_MONTHLY = 11000000;
const DEPENDENT_DEDUCTION_MONTHLY = 4400000;
const BASE_SALARY = 2340000; 
const MAX_BHXH_BHYT_SALARY = BASE_SALARY * 20; 

// Lương tối thiểu vùng (Dùng để tính trần BHTN)
const MIN_REGIONAL_SALARY = {
  'I': 4960000,
  'II': 4410000,
  'III': 3860000,
  'IV': 3450000
};

// ==========================================
// 2. CÁC HÀM TÍNH TOÁN LOGIC
// ==========================================
function calcAnnualProgressiveTax(annualTaxable) {
  const brackets = [
    { limit: 60000000, rate: 0.05 },
    { limit: 120000000, rate: 0.1 },
    { limit: 216000000, rate: 0.15 },
    { limit: 384000000, rate: 0.2 },
    { limit: 624000000, rate: 0.25 },
    { limit: 960000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 },
  ];
  let tax = 0;
  let prev = 0;
  for (let i = 0; i < brackets.length; i++) {
    const { limit, rate } = brackets[i];
    const taxableInBracket = Math.max(0, Math.min(annualTaxable, limit) - prev);
    if (taxableInBracket > 0) tax += taxableInBracket * rate;
    prev = limit;
    if (annualTaxable <= limit) break;
  }
  return tax;
}

function computeFromGross(gross, dependents, method, region) {
  // Tính mức trần BHTN (20 lần lương tối thiểu vùng)
  const maxBHTNSalary = MIN_REGIONAL_SALARY[region] * 20;

  // Tính bảo hiểm có áp trần
  const bhxh = Math.min(gross, MAX_BHXH_BHYT_SALARY) * 0.08;
  const bhyt = Math.min(gross, MAX_BHXH_BHYT_SALARY) * 0.015;
  const bhtn = Math.min(gross, maxBHTNSalary) * 0.01;
  const totalInsurance = bhxh + bhyt + bhtn;

  // Thu nhập tính thuế
  const taxableMonthly = Math.max(0, gross - totalInsurance - PERSONAL_DEDUCTION_MONTHLY - (dependents * DEPENDENT_DEDUCTION_MONTHLY));
  
  let taxMonthly = 0;
  if (taxableMonthly > 0) {
    if (method === 'flat10') taxMonthly = taxableMonthly * 0.1;
    else taxMonthly = calcAnnualProgressiveTax(taxableMonthly * 12) / 12;
  }
  
  const net = gross - totalInsurance - taxMonthly;
  return { gross, insurance: totalInsurance, taxableMonthly, taxMonthly, net };
}

function computeGrossFromNet(targetNet, dependents, method, region) {
  let low = 0;
  let high = Math.max(targetNet * 1.5 + 1000000, targetNet + 1000000);
  
  while (computeFromGross(high, dependents, method, region).net < targetNet && high < 1e12) {
    high *= 2;
  }
  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2;
    const netMid = computeFromGross(mid, dependents, method, region).net;
    if (Math.abs(netMid - targetNet) < 0.5) return computeFromGross(mid, dependents, method, region);
    if (netMid < targetNet) low = mid; else high = mid;
  }
  return computeFromGross((low + high) / 2, dependents, method, region);
}

function formatValue(value, currency) {
  if (!isFinite(value)) return '-';
  if (currency === 'VND') return new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' đ';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

// ==========================================
// 3. GIAO DIỆN COMPONENT CHÍNH
// ==========================================
export default function SalaryCalculator() {
  const [currency, setCurrency] = useState('VND');
  const [mode, setMode] = useState('gross'); 
  const [amount, setAmount] = useState('');
  const [dependents, setDependents] = useState(0);
  const [method, setMethod] = useState('progressive'); 
  const [region, setRegion] = useState('I');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    let v = parseFloat(amount) || 0;
    const exchangeRate = 25400; 
    
    
    if (currency === 'USD') v = v * exchangeRate; 

    let res;
    if (mode === 'gross') {
      res = computeFromGross(v, Number(dependents), method, region);
    } else {
      res = computeGrossFromNet(v, Number(dependents), method, region);
    }

    
    if (currency === 'USD') {
      res.gross /= exchangeRate;
      res.insurance /= exchangeRate;
      res.taxableMonthly /= exchangeRate;
      res.taxMonthly /= exchangeRate;
      res.net /= exchangeRate;
    }

    setResult(res);
  };

  const handleReset = () => {
    setAmount('');
    setDependents(0);
    setMethod('progressive');
    setRegion('I');
    setResult(null);
  };

  return (
    <div className="salary-container">
      <main className="salary-main">
        <h2>Máy tính Lương (Gross ↔ Net)</h2>

        <div className="calc-controls">
          <div className="row">
            <label>Đơn vị tiền tệ:</label>
            <div className="radio-group">
              <label><input type="radio" checked={currency === 'VND'} onChange={() => setCurrency('VND')} /> VND</label>
              <label><input type="radio" checked={currency === 'USD'} onChange={() => setCurrency('USD')} /> USD</label>
            </div>
          </div>

          <div className="row">
            <label>Chế độ tính:</label>
            <div className="mode-buttons">
              <button className={mode === 'gross' ? 'active' : ''} onClick={() => setMode('gross')}>GROSS → NET</button>
              <button className={mode === 'net' ? 'active' : ''} onClick={() => setMode('net')}>NET → GROSS</button>
            </div>
          </div>

          <div className="row">
            <label>{mode === 'gross' ? 'Nhập lương Gross (tháng):' : 'Nhập lương Net (tháng):'}</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input" placeholder="VD: 20000000" />
          </div>

          <div className="row small">
            <label>Số người phụ thuộc:</label>
            <input type="number" min="0" max="20" value={dependents} onChange={(e) => setDependents(e.target.value)} className="input small-input" />
            
            <label>Phương pháp tính thuế:</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="input small-input">
              <option value="progressive">Thuế lũy tiến từng phần</option>
              <option value="flat10">Thuế suất cố định 10%</option>
            </select>
          </div>

          <div className="row small">
            <label>Vùng:</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="input small-input">
              <option value="I">Vùng I (Hà Nội, TP.HCM...)</option>
              <option value="II">Vùng II</option>
              <option value="III">Vùng III</option>
              <option value="IV">Vùng IV</option>
            </select>
            <div className="spacer" style={{ flex: 1 }} />
            <button onClick={handleCalculate} className="btn primary">Tính</button>
            <button onClick={handleReset} className="btn">Làm mới</button>
          </div>
        </div>

        <div className="result-block">
          <h3>Kết quả</h3>
          {!result && <div className="hint">Nhập số và bấm "Tính" để xem kết quả.</div>}
          {result && (
            <div className="result-grid">
              <div className="result-row"><strong>Gross (tính trên):</strong> <span>{formatValue(result.gross, currency)}</span></div>
              <div className="result-row"><strong>Bảo hiểm (BHXH 8%, BHYT 1.5%, BHTN 1%):</strong> <span style={{ color: '#d9534f' }}>- {formatValue(result.insurance, currency)}</span></div>
              <div className="result-row"><strong>Thu nhập tính thuế (tháng):</strong> <span>{formatValue(result.taxableMonthly, currency)}</span></div>
              <div className="result-row"><strong>Thuế TNCN (tháng):</strong> <span style={{ color: '#d9534f' }}>- {formatValue(result.taxMonthly, currency)}</span></div>
              <hr style={{ margin: '15px 0', borderColor: '#eee' }} />
              <div className="result-row total" style={{ fontSize: '18px', color: '#00a65a' }}><strong>Lương thực lĩnh (Net):</strong> <strong>{formatValue(result.net, currency)}</strong></div>
            </div>
          )}
        </div>
      </main>

      
      <aside className="salary-sidebar">
        <SalarySidebar />
      </aside>
    </div>
  );
}