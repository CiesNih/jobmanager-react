# 📋 ViecLam API Documentation

## 🎯 Tổng Quan

API quản lý tin tuyển dụng với 3 nhóm quyền:
- **Public**: Xem tin đã duyệt (không cần đăng nhập)
- **NhaTuyenDung**: Đăng, sửa, xóa tin của mình
- **Admin**: Duyệt tin, xem tất cả tin

---

## 📊 Trạng Thái Tin Tuyển Dụng

| Trạng Thái | Mô Tả | Ai Có Thể Thấy |
|------------|-------|----------------|
| `ChoDuyet` | Tin mới đăng, chờ Admin duyệt | NhaTuyenDung (chủ tin), Admin |
| `DaDuyet` | Tin đã được Admin duyệt | Tất cả mọi người |
| `TuChoi` | Tin bị Admin từ chối | NhaTuyenDung (chủ tin), Admin |
| `HetHan` | Tin đã quá hạn nộp hồ sơ | Tất cả (nhưng không hiển thị ở public) |
| `DaDong` | Tin đã đóng tuyển dụng | Tất cả |

---

## 🌐 PUBLIC ENDPOINTS (Không Cần Token)

### 1. Lấy Danh Sách Việc Làm Công Khai

```http
GET /api/ViecLam/public
```

**Query Parameters:**
```javascript
{
  keyword: "string",           // Tìm trong tiêu đề và mô tả
  diaDiem: "string",           // Lọc theo địa điểm
  loaiHinhCongViec: "string",  // Full-time, Part-time, Remote, etc.
  mucLuongMin: number,         // Lương tối thiểu
  mucLuongMax: number,         // Lương tối đa
  maCongTy: "guid",            // Lọc theo công ty
  page: 1,                     // Trang hiện tại
  pageSize: 10,                // Số item mỗi trang
  sortBy: "NgayTao",           // NgayTao, TieuDe, MucLuong, HanNopHoSo
  sortOrder: "desc"            // asc hoặc desc
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "maViecLam": "guid",
        "tieuDe": "Senior Backend Developer",
        "diaDiem": "Hà Nội",
        "loaiHinhCongViec": "Full-time",
        "mucLuongMin": 20000000,
        "mucLuongMax": 30000000,
        "hanNopHoSo": "2024-12-31T00:00:00",
        "trangThai": "DaDuyet",
        "tenCongTy": "FPT Software",
        "logoCongTy": "https://...",
        "ngayTao": "2024-01-15T10:00:00",
        "soLuongUngTuyen": 25
      }
    ],
    "totalItems": 150,
    "totalPages": 15,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

**Example:**
```bash
# Tìm việc Backend ở Hà Nội
GET /api/ViecLam/public?keyword=backend&diaDiem=Hà Nội&page=1&pageSize=20

# Lọc theo mức lương
GET /api/ViecLam/public?mucLuongMin=15000000&mucLuongMax=30000000

# Xem việc của công ty cụ thể
GET /api/ViecLam/public?maCongTy=abc-123-def-456
```

---

### 2. Xem Chi Tiết Việc Làm Công Khai

```http
GET /api/ViecLam/public/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "maViecLam": "guid",
    "tieuDe": "Senior Backend Developer",
    "moTaCongViec": "Mô tả chi tiết...",
    "yeuCau": "- 3+ năm kinh nghiệm...",
    "quyenLoi": "- Lương thưởng hấp dẫn...",
    "mucLuongMin": 20000000,
    "mucLuongMax": 30000000,
    "diaDiem": "Hà Nội",
    "loaiHinhCongViec": "Full-time",
    "soLuongTuyen": 2,
    "hanNopHoSo": "2024-12-31T00:00:00",
    "trangThai": "DaDuyet",
    "ngayTao": "2024-01-15T10:00:00",
    "ngayCapNhat": "2024-01-15T10:00:00",
    "maCongTy": "guid",
    "tenCongTy": "FPT Software",
    "logoCongTy": "https://...",
    "nguoiDangTin": "guid",
    "tenNguoiDangTin": "Nguyễn Văn A",
    "soLuongUngTuyen": 25
  }
}
```

---

## 👔 NHÀ TUYỂN DỤNG ENDPOINTS (Cần Token)

### 3. Lấy Danh Sách Tin Của Tôi

```http
GET /api/ViecLam/my-jobs
Authorization: Bearer {token}
```

**Query Parameters:**
```javascript
{
  trangThai: "ChoDuyet",  // Lọc theo trạng thái
  keyword: "string",       // Tìm trong tiêu đề
  page: 1,
  pageSize: 10
}
```

**Response:** Giống như public list nhưng bao gồm cả tin chưa duyệt

---

### 4. Tạo Tin Tuyển Dụng Mới

```http
POST /api/ViecLam
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "tieuDe": "Senior Backend Developer",
  "moTaCongViec": "Mô tả chi tiết công việc...",
  "yeuCau": "- 3+ năm kinh nghiệm\n- Thành thạo C#, .NET Core",
  "quyenLoi": "- Lương 20-30M\n- Thưởng tháng 13",
  "mucLuongMin": 20000000,
  "mucLuongMax": 30000000,
  "diaDiem": "Hà Nội",
  "loaiHinhCongViec": "Full-time",
  "soLuongTuyen": 2,
  "hanNopHoSo": "2024-12-31T00:00:00",
  "maCongTy": "guid-cong-ty"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo tin tuyển dụng thành công! Tin đang chờ duyệt.",
  "data": {
    "maViecLam": "new-guid",
    "trangThai": "ChoDuyet",
    ...
  }
}
```

**Validation:**
- ✅ `tieuDe`: Required
- ✅ `diaDiem`: Required
- ✅ `maCongTy`: Required và phải tồn tại
- ✅ Tin mới tạo sẽ có trạng thái `ChoDuyet`

---

### 5. Cập Nhật Tin Tuyển Dụng

```http
PUT /api/ViecLam/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** (Tất cả fields đều optional)
```json
{
  "tieuDe": "Updated Title",
  "moTaCongViec": "Updated description",
  "mucLuongMin": 25000000,
  "hanNopHoSo": "2025-01-31T00:00:00"
}
```

**Quy Tắc:**
- ❌ Không thể cập nhật tin đã duyệt (`DaDuyet`)
- ❌ Không thể cập nhật tin đã từ chối (`TuChoi`)
- ✅ Chỉ cập nhật được tin của mình
- ✅ Chỉ cập nhật tin `ChoDuyet`

---

### 6. Xóa Tin Tuyển Dụng

```http
DELETE /api/ViecLam/{id}
Authorization: Bearer {token}
```

**Quy Tắc:**
- ❌ Không thể xóa tin đã có đơn ứng tuyển
- ✅ Chỉ xóa được tin của mình
- ✅ Có thể xóa tin ở bất kỳ trạng thái nào (nếu chưa có đơn)

**Response:**
```json
{
  "success": true,
  "message": "Xóa tin tuyển dụng thành công!"
}
```

---

### 7. Xem Chi Tiết Tin Của Tôi

```http
GET /api/ViecLam/{id}
Authorization: Bearer {token}
```

**Response:** Giống như public detail nhưng bao gồm thông tin người duyệt

---

## 🔐 ADMIN ENDPOINTS (Cần Token Admin)

### 8. Lấy Tất Cả Tin Tuyển Dụng

```http
GET /api/ViecLam/admin/all
Authorization: Bearer {admin-token}
```

**Query Parameters:**
```javascript
{
  trangThai: "ChoDuyet",  // Lọc theo trạng thái
  keyword: "string",       // Tìm trong tiêu đề và tên công ty
  maCongTy: "guid",        // Lọc theo công ty
  page: 1,
  pageSize: 10
}
```

**Use Cases:**
- Xem tất cả tin chờ duyệt: `?trangThai=ChoDuyet`
- Xem tin đã từ chối: `?trangThai=TuChoi`
- Xem tin của công ty: `?maCongTy=abc-123`

---

### 9. Duyệt Hoặc Từ Chối Tin

```http
PATCH /api/ViecLam/admin/{id}/duyet
Authorization: Bearer {admin-token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "trangThai": "DaDuyet",  // "DaDuyet" hoặc "TuChoi"
  "lyDoTuChoi": "Nội dung không phù hợp"  // Optional, dùng khi từ chối
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đã duyệt tin tuyển dụng thành công!",
  "data": {
    "maViecLam": "guid",
    "trangThai": "DaDuyet",
    "nguoiDuyet": "admin-guid",
    "ngayDuyet": "2024-01-20T14:30:00"
  }
}
```

**Quy Tắc:**
- ✅ Chỉ duyệt được tin `ChoDuyet`
- ✅ Tự động ghi nhận người duyệt và thời gian duyệt
- ❌ Không thể duyệt lại tin đã xử lý

---

### 10. Thống Kê Tin Tuyển Dụng

```http
GET /api/ViecLam/admin/statistics
Authorization: Bearer {admin-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 500,
    "choDuyet": 25,
    "daDuyet": 450,
    "tuChoi": 20,
    "hetHan": 5
  }
}
```

---

## 🔄 WORKFLOW DIAGRAM

```
┌─────────────────┐
│ NhaTuyenDung    │
│ Tạo Tin Mới     │
└────────┬────────┘
         │
         ▼
   ┌──────────┐
   │ ChoDuyet │ ◄──── Tin mới tạo
   └────┬─────┘
        │
        │ Admin xem xét
        │
        ├─────────────┬─────────────┐
        ▼             ▼             ▼
   ┌─────────┐   ┌────────┐   ┌────────┐
   │ DaDuyet │   │ TuChoi │   │ HetHan │
   └────┬────┘   └────────┘   └────────┘
        │
        │ Hiển thị công khai
        │
        ▼
   ┌──────────────┐
   │ Ứng viên xem │
   │ và ứng tuyển │
   └──────────────┘
```

---

## 📝 VALIDATION RULES

### Tạo/Cập Nhật Tin:
- ✅ `tieuDe`: Required, max 200 chars
- ✅ `diaDiem`: Required
- ✅ `maCongTy`: Required, phải tồn tại
- ✅ `mucLuongMin` ≤ `mucLuongMax`
- ✅ `hanNopHoSo` phải là ngày tương lai
- ✅ `soLuongTuyen` > 0

### Duyệt Tin:
- ✅ Chỉ duyệt tin `ChoDuyet`
- ✅ `trangThai` chỉ nhận `DaDuyet` hoặc `TuChoi`
- ✅ Nếu `TuChoi`, nên có `lyDoTuChoi`

---

## 🚨 ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Không thể cập nhật tin đã DaDuyet!"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Không xác định được người dùng!"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Bạn không có quyền truy cập tài nguyên này!"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy tin tuyển dụng!"
}
```

---

## 💡 USE CASES

### Use Case 1: Nhà Tuyển Dụng Đăng Tin
```javascript
// 1. Đăng nhập
POST /api/Auth/login
{ "email": "hr@company.com", "password": "123456" }

// 2. Lấy token từ response
const token = response.data.token;

// 3. Tạo tin mới
POST /api/ViecLam
Headers: { Authorization: `Bearer ${token}` }
Body: { tieuDe: "...", maCongTy: "...", ... }

// 4. Kiểm tra tin của mình
GET /api/ViecLam/my-jobs?trangThai=ChoDuyet
Headers: { Authorization: `Bearer ${token}` }
```

### Use Case 2: Admin Duyệt Tin
```javascript
// 1. Đăng nhập với tài khoản Admin
POST /api/Auth/login
{ "email": "admin@system.com", "password": "admin123" }

// 2. Xem tin chờ duyệt
GET /api/ViecLam/admin/all?trangThai=ChoDuyet
Headers: { Authorization: `Bearer ${adminToken}` }

// 3. Duyệt tin
PATCH /api/ViecLam/admin/{id}/duyet
Headers: { Authorization: `Bearer ${adminToken}` }
Body: { trangThai: "DaDuyet" }
```

### Use Case 3: Ứng Viên Tìm Việc
```javascript
// 1. Tìm việc (không cần token)
GET /api/ViecLam/public?keyword=backend&diaDiem=Hà Nội

// 2. Xem chi tiết
GET /api/ViecLam/public/{id}

// 3. Ứng tuyển (cần đăng nhập - API khác)
POST /api/DonUngTuyen
```

---

## 🔧 TESTING

### Postman Collection
```json
{
  "info": { "name": "ViecLam API" },
  "item": [
    {
      "name": "Public - Get Jobs",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/ViecLam/public?page=1&pageSize=10"
      }
    },
    {
      "name": "NTD - Create Job",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/ViecLam",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{ \"tieuDe\": \"Test Job\", ... }"
        }
      }
    }
  ]
}
```

---

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Kiểm tra token có hợp lệ không
2. Kiểm tra role có đúng không
3. Xem logs trong console
4. Liên hệ backend team

---

## 📚 RELATED APIs

- **DonUngTuyen API**: Quản lý đơn ứng tuyển
- **UngVien API**: Quản lý hồ sơ ứng viên
- **CongTy API**: Quản lý công ty
- **Auth API**: Đăng nhập, đăng ký
