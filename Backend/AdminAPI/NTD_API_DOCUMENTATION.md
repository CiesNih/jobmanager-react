# 📋 Nhà Tuyển Dụng API Documentation

## 🎯 Tổng Quan

API dành cho **Nhà Tuyển Dụng** quản lý việc làm, đơn ứng tuyển và lịch phỏng vấn.

**Base URL:** `/api/ntd`

**Authorization:** Tất cả endpoints yêu cầu token với role `NhaTuyenDung`

---

## 🔐 Authentication

Tất cả requests phải có header:
```
Authorization: Bearer {token}
```

Token lấy từ endpoint `/api/Auth/login` với tài khoản có role `NhaTuyenDung`.

---

## 📊 API ENDPOINTS

### 1. Lấy Danh Sách Việc Làm Của Công Ty

```http
GET /api/ntd/vieclam
```

**Query Parameters:**
```javascript
{
  maCongTy: "guid",      // Required - Mã công ty
  daDuyet: boolean,      // Optional - Lọc theo trạng thái duyệt
  page: 1,               // Optional - Trang hiện tại (default: 1)
  pageSize: 10           // Optional - Số item/trang (default: 10)
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "maViecLam": "guid",
      "tieuDe": "Senior Backend Developer",
      "diaDiem": "Hà Nội",
      "loaiHinhCongViec": "Full-time",
      "capBac": "Senior",
      "mucLuong": "20-30 triệu",
      "hanUngTuyen": "2024-12-31T00:00:00",
      "daDuyet": true,
      "ngayDang": "2024-01-15T10:00:00",
      "ngayHetHan": "2024-12-31T23:59:59",
      "luotXem": 150,
      "soLuongUngTuyen": 25
    }
  ],
  "pagination": {
    "totalItems": 50,
    "totalPages": 5,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

**Example:**
```bash
GET /api/ntd/vieclam?maCongTy=abc-123-def&daDuyet=true&page=1&pageSize=20
Authorization: Bearer {token}
```

---

### 2. Lấy Danh Sách Đơn Ứng Tuyển

```http
GET /api/ntd/don-ung-tuyen
```

**Query Parameters:**
```javascript
{
  maViecLam: "guid",     // Required - Mã việc làm
  trangThai: "string",   // Optional - "DaNop", "DaXem", "PhongVan", "TuChoi", "ChapNhan"
  keyword: "string",     // Optional - Tìm theo tên, email ứng viên
  tuNgay: "2024-01-01",  // Optional - Lọc từ ngày
  denNgay: "2024-12-31", // Optional - Lọc đến ngày
  page: 1,
  pageSize: 10,
  sortBy: "NgayNop",     // Optional - "NgayNop", "HoTen", "TrangThai"
  sortOrder: "desc"      // Optional - "asc" hoặc "desc"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "maDonUngTuyen": "guid",
        "maViecLam": "guid",
        "tenViecLam": "Senior Backend Developer",
        "trangThai": "DaNop",
        "ngayNop": "2024-01-20T14:30:00",
        "ngayCapNhat": "2024-01-20T14:30:00",
        
        "maUngVien": "guid",
        "hoTen": "Nguyễn Văn A",
        "email": "nguyenvana@gmail.com",
        "soDienThoai": "0912345678",
        "avatar": "https://...",
        "ngaySinh": "1995-05-15T00:00:00",
        "gioiTinh": "Nam",
        "diaChi": "Hà Nội",
        "soNamKinhNghiem": "3 năm",
        
        "maHoSoUngTuyen": "guid",
        "moTaBanThan": "Tôi là một developer...",
        "duongDanLuuTru": "https://storage.com/cv/abc.pdf",
        "kinhNghiem": "3 năm làm Backend với .NET",
        "hocVan": "Đại học Bách Khoa Hà Nội",
        "kyNang": "C#, .NET Core, SQL Server, Docker",
        
        "daCoLichPhongVan": false,
        "thoiGianPhongVan": null
      }
    ],
    "totalItems": 25,
    "totalPages": 3,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

**Example:**
```bash
GET /api/ntd/don-ung-tuyen?maViecLam=abc-123&trangThai=DaNop&page=1
Authorization: Bearer {token}
```

---

### 3. Tạo Lịch Phỏng Vấn

```http
POST /api/ntd/phong-van
```

**Request Body:**
```json
{
  "maDon": "guid",                    // Required - Mã đơn ứng tuyển
  "maDangPhongVan": "Online",         // Optional - "Online", "Offline", "Hybrid"
  "thoiGian": "2024-02-15 14:00:00",  // Required - Thời gian phỏng vấn
  "thoiLuong": "60 phút",             // Optional
  "diaDiem": "Phòng họp A, Tầng 5",   // Optional
  "ghiChu": "Mang theo CMND và bằng cấp" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo lịch phỏng vấn thành công!",
  "data": {
    "maPhongVan": "new-guid",
    "maDon": "guid",
    "maDangPhongVan": "Online",
    "thoiGian": "2024-02-15 14:00:00",
    "thoiLuong": "60 phút",
    "diaDiem": "Phòng họp A, Tầng 5",
    "ghiChu": "Mang theo CMND và bằng cấp",
    "ngayTao": "2024-01-25T10:00:00",
    "tenUngVien": "Nguyễn Văn A",
    "emailUngVien": "nguyenvana@gmail.com",
    "soDienThoaiUngVien": "0912345678",
    "tenViecLam": "Senior Backend Developer"
  }
}
```

**Validation:**
- ✅ `maDon`: Required, phải tồn tại
- ✅ `thoiGian`: Required
- ✅ Đơn chưa có lịch phỏng vấn
- ✅ Tự động cập nhật trạng thái đơn thành "PhongVan"

**Example:**
```bash
POST /api/ntd/phong-van
Authorization: Bearer {token}
Content-Type: application/json

{
  "maDon": "abc-123-def",
  "maDangPhongVan": "Online",
  "thoiGian": "2024-02-15 14:00:00",
  "thoiLuong": "60 phút",
  "diaDiem": "Google Meet",
  "ghiChu": "Link sẽ được gửi qua email"
}
```

---

## 🎁 BONUS ENDPOINTS

### 4. Lấy Chi Tiết Lịch Phỏng Vấn

```http
GET /api/ntd/phong-van/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "maPhongVan": "guid",
    "maDon": "guid",
    "maDangPhongVan": "Online",
    "thoiGian": "2024-02-15 14:00:00",
    "thoiLuong": "60 phút",
    "diaDiem": "Google Meet",
    "ghiChu": "Link: https://meet.google.com/abc-def",
    "ngayTao": "2024-01-25T10:00:00",
    "tenUngVien": "Nguyễn Văn A",
    "emailUngVien": "nguyenvana@gmail.com",
    "soDienThoaiUngVien": "0912345678",
    "tenViecLam": "Senior Backend Developer"
  }
}
```

---

### 5. Cập Nhật Trạng Thái Đơn Ứng Tuyển

```http
PATCH /api/ntd/don-ung-tuyen/{id}/trang-thai
```

**Request Body:**
```json
{
  "trangThai": "DaXem",  // Required - "DaNop", "DaXem", "PhongVan", "TuChoi", "ChapNhan"
  "ghiChu": "Ứng viên phù hợp"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công!",
  "data": {
    "maDonUngTuyen": "guid",
    "trangThai": "DaXem",
    "ngayCapNhat": "2024-01-25T15:30:00"
  }
}
```

**Trạng Thái Hợp Lệ:**
- `DaNop` - Đơn mới nộp
- `DaXem` - Đã xem hồ sơ
- `PhongVan` - Mời phỏng vấn
- `TuChoi` - Từ chối
- `ChapNhan` - Chấp nhận (gửi thư mời làm việc)

---

### 6. Thống Kê Cho Nhà Tuyển Dụng

```http
GET /api/ntd/thong-ke?maCongTy={guid}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tongViecLam": 50,
    "viecLamDaDuyet": 45,
    "viecLamChoDuyet": 5,
    "tongDonUngTuyen": 250,
    "donMoi": 30,
    "donDaXem": 80,
    "donPhongVan": 50,
    "donChapNhan": 20,
    "donTuChoi": 70
  }
}
```

---

## 🔄 WORKFLOW

```
1. NTD đăng tin tuyển dụng
   ↓
2. Ứng viên nộp đơn → Trạng thái: "DaNop"
   ↓
3. NTD xem danh sách đơn (GET /api/ntd/don-ung-tuyen)
   ↓
4. NTD xem chi tiết hồ sơ
   ↓
5. NTD cập nhật trạng thái:
   - "DaXem" - Đã xem
   - "TuChoi" - Từ chối
   - "PhongVan" - Mời phỏng vấn
   ↓
6. Nếu mời phỏng vấn:
   POST /api/ntd/phong-van
   → Tự động cập nhật trạng thái đơn thành "PhongVan"
   → Gửi email thông báo cho ứng viên
   ↓
7. Sau phỏng vấn:
   - "ChapNhan" - Gửi thư mời làm việc
   - "TuChoi" - Từ chối
```

---

## 📝 USE CASES

### Use Case 1: Xem Đơn Ứng Tuyển Mới

```javascript
// 1. Đăng nhập
POST /api/Auth/login
{ "email": "hr@company.com", "password": "123456" }

// 2. Lấy token
const token = response.data.token;

// 3. Xem đơn mới của một việc làm
GET /api/ntd/don-ung-tuyen?maViecLam=abc-123&trangThai=DaNop
Headers: { Authorization: `Bearer ${token}` }

// 4. Xem chi tiết hồ sơ (trong response đã có đầy đủ)
// Tải CV từ duongDanLuuTru
```

### Use Case 2: Tạo Lịch Phỏng Vấn

```javascript
// 1. Chọn ứng viên phù hợp từ danh sách
const maDon = "selected-don-guid";

// 2. Tạo lịch phỏng vấn
POST /api/ntd/phong-van
Headers: { Authorization: `Bearer ${token}` }
Body: {
  maDon: maDon,
  maDangPhongVan: "Online",
  thoiGian: "2024-02-15 14:00:00",
  thoiLuong: "60 phút",
  diaDiem: "Google Meet",
  ghiChu: "Link: https://meet.google.com/abc-def"
}

// 3. Hệ thống tự động:
//    - Cập nhật trạng thái đơn thành "PhongVan"
//    - Gửi email thông báo cho ứng viên
```

### Use Case 3: Quản Lý Trạng Thái Đơn

```javascript
// 1. Xem đơn đã phỏng vấn
GET /api/ntd/don-ung-tuyen?maViecLam=abc-123&trangThai=PhongVan

// 2. Cập nhật trạng thái sau phỏng vấn
PATCH /api/ntd/don-ung-tuyen/{id}/trang-thai
Body: {
  trangThai: "ChapNhan",
  ghiChu: "Ứng viên xuất sắc, chấp nhận với mức lương 25M"
}

// 3. Hoặc từ chối
PATCH /api/ntd/don-ung-tuyen/{id}/trang-thai
Body: {
  trangThai: "TuChoi",
  ghiChu: "Kinh nghiệm chưa đủ"
}
```

---

## 🚨 ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Vui lòng cung cấp mã công ty!"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Không xác định được người dùng!"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy đơn ứng tuyển!"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Lỗi server!",
  "error": "Error details..."
}
```

---

## 📊 DATABASE RELATIONSHIPS

```
CongTy (1) ──→ (N) ViecLam
ViecLam (1) ──→ (N) DonUngTuyen
UngVien (1) ──→ (N) DonUngTuyen
UngVien (1) ──→ (N) HoSo
DonUngTuyen (1) ──→ (0..1) PhongVan
```

---

## 🔧 TESTING

### Postman Collection

```json
{
  "info": { "name": "NTD API" },
  "item": [
    {
      "name": "Get Viec Lam",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/ntd/vieclam?maCongTy={{maCongTy}}",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ]
      }
    },
    {
      "name": "Get Don Ung Tuyen",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/ntd/don-ung-tuyen?maViecLam={{maViecLam}}",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ]
      }
    },
    {
      "name": "Tao Phong Van",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/ntd/phong-van",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"maDon\": \"{{maDon}}\",\n  \"thoiGian\": \"2024-02-15 14:00:00\"\n}"
        }
      }
    }
  ]
}
```

---

## 💡 BEST PRACTICES

### 1. Pagination
- Luôn sử dụng pagination cho danh sách
- Default pageSize = 10, max = 100

### 2. Filtering
- Kết hợp nhiều filter để tìm chính xác
- Sử dụng keyword để tìm nhanh

### 3. Status Management
- Cập nhật trạng thái theo workflow
- Không nhảy cóc trạng thái

### 4. Error Handling
- Luôn check response.success
- Hiển thị message cho user

---

## 📞 SUPPORT

- **Documentation:** Xem file này
- **API Issues:** Liên hệ backend team
- **Feature Requests:** Tạo ticket

---

## 📝 CHANGELOG

### Version 1.0.0
- ✅ GET /api/ntd/vieclam
- ✅ GET /api/ntd/don-ung-tuyen
- ✅ POST /api/ntd/phong-van
- ✅ GET /api/ntd/phong-van/{id}
- ✅ PATCH /api/ntd/don-ung-tuyen/{id}/trang-thai
- ✅ GET /api/ntd/thong-ke

### TODO
- [ ] PUT /api/ntd/phong-van/{id} - Cập nhật lịch phỏng vấn
- [ ] DELETE /api/ntd/phong-van/{id} - Hủy lịch phỏng vấn
- [ ] POST /api/ntd/thu-moi - Gửi thư mời làm việc
- [ ] GET /api/ntd/bao-cao - Báo cáo tuyển dụng
