import React from 'react';
import '../styles/SalaryCalculator.css';

export default function SalarySidebar() {
  return (
    <div className="sidebar-wrap">
      <div className="sidebar-box">
        <h4>Giải thích lương Gross & Net</h4>
        <p>
          Lương Gross là tổng thu nhập ghi trong hợp đồng (chưa trừ BH, thuế). Lương Net là số thực nhận sau khi trừ các khoản: BHXH, BHYT, BHTN và Thuế TNCN.
        </p>
        <p>
          Mức giảm trừ gia cảnh hiện tại: 11.000.000 đ/tháng (người nộp thuế) và 4.400.000 đ/tháng/ người phụ thuộc.
        </p>
      </div>

      <div className="sidebar-box">
        <h4>Mức Lương Vị Trí Phổ Biến</h4>
        <ul className="positions-list">
          <li><span>Nhân Viên Tư Vấn</span><span className="range">9 - 20 triệu VND</span></li>
          <li><span>Trưởng Phòng Kinh Doanh</span><span className="range">17 - 33 triệu VND</span></li>
          <li><span>Nhân Viên Bán Hàng</span><span className="range">7 - 14 triệu VND</span></li>
          <li><span>Giám Sát Bán Hàng</span><span className="range">13 - 24 triệu VND</span></li>
          <li><span>Online Marketing</span><span className="range">9 - 19 triệu VND</span></li>
        </ul>
      </div>

      <div className="sidebar-box note">
        <h4>Ghi chú</h4>
        <p>Giá trị tính toán mang tính tham khảo. Nếu cần mình có thể thêm lựa chọn hệ số BH, thuế tạm tính theo năm, hoặc chuyển đổi VND↔USD.</p>
      </div>
    </div>
  );
}