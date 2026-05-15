# 🔐 Hướng Dẫn Migration Mật Khẩu Sang BCrypt

## ⚠️ QUAN TRỌNG - ĐỌC KỸ TRƯỚC KHI THỰC HIỆN

Migration này sẽ chuyển đổi tất cả mật khẩu từ format cũ (plaintext + "hash") sang BCrypt hash an toàn.

---

## 📋 Các Bước Thực Hiện

### **Bước 1: Cài Đặt Package BCrypt**

Package đã được thêm vào `AdminAPI.csproj`:
```xml
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
```

Chạy lệnh restore:
```bash
cd Backend/BTL_Api/AdminAPI
dotnet restore
```

---

### **Bước 2: Backup Database**

**QUAN TRỌNG:** Backup database trước khi migrate!

```sql
-- Chạy trong SQL Server Management Studio
SELECT * INTO Nguoidung_Backup_BeforeBCrypt FROM Nguoidung;
```

---

### **Bước 3: Build và Chạy API**

```bash
cd Backend/BTL_Api/AdminAPI
dotnet build
dotnet run
```

API sẽ chạy tại: `https://localhost:7xxx` hoặc `http://localhost:5xxx`

---

### **Bước 4: Kiểm Tra Trạng Thái Migration**

Gọi API để kiểm tra:
```bash
GET https://localhost:7xxx/api/Migration/check-migration-status
```

Response:
```json
{
  "totalUsers": 10,
  "bcryptUsers": 0,
  "oldFormatUsers": 10,
  "migrationComplete": false,
  "message": "⚠️ Còn 10 mật khẩu chưa migrate"
}
```

---

### **Bước 5: Chạy Migration**

**LƯU Ý:** Endpoint này CHỈ CHẠY 1 LẦN!

```bash
POST https://localhost:7xxx/api/Migration/migrate-passwords
```

Response thành công:
```json
{
  "success": true,
  "message": "Đã migrate 10 mật khẩu sang BCrypt thành công!",
  "migratedCount": 10,
  "details": [
    "✅ Migrated: admin@example.com (Password: 123456)",
    "✅ Migrated: user@example.com (Password: password123)",
    ...
  ]
}
```

---

### **Bước 6: Xác Nhận Migration Thành Công**

Kiểm tra lại:
```bash
GET https://localhost:7xxx/api/Migration/check-migration-status
```

Response:
```json
{
  "totalUsers": 10,
  "bcryptUsers": 10,
  "oldFormatUsers": 0,
  "migrationComplete": true,
  "message": "✅ Tất cả mật khẩu đã được migrate sang BCrypt"
}
```

---

### **Bước 7: Test Đăng Nhập**

Test với mật khẩu cũ để đảm bảo BCrypt hoạt động:

```bash
POST https://localhost:7xxx/api/Auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "123456"
}
```

Nếu thành công, bạn sẽ nhận được JWT token.

---

### **Bước 8: Xóa Migration Controller (Tùy Chọn)**

Sau khi migration xong, để bảo mật, nên xóa file:
```
Backend/BTL_Api/AdminAPI/Controllers/MigrationController.cs
```

Hoặc comment lại các endpoint trong controller.

---

## 🔍 Kiểm Tra Trong Database

Trước migration:
```sql
SELECT Email, MatKhauHash FROM Nguoidung;
-- MatKhauHash = "123456hash"
```

Sau migration:
```sql
SELECT Email, MatKhauHash FROM Nguoidung;
-- MatKhauHash = "$2a$11$abcdef..." (BCrypt hash)
```

---

## 🚨 Xử Lý Lỗi

### Lỗi: "Không kết nối được database"
- Kiểm tra connection string trong `appsettings.json`
- Đảm bảo SQL Server đang chạy

### Lỗi: "Package BCrypt.Net-Next not found"
- Chạy `dotnet restore`
- Kiểm tra internet connection

### Lỗi: "Migration failed"
- Restore database từ backup
- Kiểm tra logs để xem lỗi cụ thể
- Liên hệ dev team

---

## 📝 Lưu Ý Quan Trọng

1. ✅ **Backup database trước khi migrate**
2. ✅ **Chỉ chạy migration 1 lần**
3. ✅ **Test đăng nhập sau khi migrate**
4. ✅ **Xóa MigrationController sau khi xong**
5. ✅ **Thông báo cho users về việc đổi mật khẩu nếu cần**

---

## 🔐 Bảo Mật Sau Migration

Sau khi migrate, hệ thống sẽ:
- ✅ Lưu mật khẩu dưới dạng BCrypt hash (không thể reverse)
- ✅ Verify mật khẩu bằng `BCrypt.Verify()`
- ✅ Tự động hash mật khẩu mới khi tạo user
- ✅ Hash mật khẩu khi reset password

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, liên hệ:
- Email: dev@yourcompany.com
- Slack: #backend-support
