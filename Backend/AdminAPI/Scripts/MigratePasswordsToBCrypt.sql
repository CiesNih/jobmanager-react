-- ========================================================
-- SCRIPT: Migrate existing passwords to BCrypt format
-- ========================================================
-- LƯU Ý: Script này chỉ chạy 1 LẦN để migrate dữ liệu cũ
-- Sau khi chạy, tất cả mật khẩu sẽ được băm bằng BCrypt
-- ========================================================

-- Bước 1: Backup bảng Nguoidung trước khi migrate
SELECT * INTO Nguoidung_Backup_BeforeBCrypt FROM Nguoidung;

-- Bước 2: Tạo bảng tạm để lưu mật khẩu mới
-- (Cần chạy C# script để hash, không thể hash trực tiếp trong SQL)

-- ========================================================
-- HƯỚNG DẪN SỬ DỤNG:
-- ========================================================
-- 1. Chạy script backup ở trên
-- 2. Tạo endpoint tạm trong C# để migrate:
--    POST /api/Admin/migrate-passwords (chỉ chạy 1 lần)
-- 3. Endpoint sẽ:
--    - Lấy tất cả users có MatKhauHash kết thúc bằng "hash"
--    - Lấy password gốc (bỏ "hash" ở cuối)
--    - Hash lại bằng BCrypt
--    - Update vào database
-- ========================================================

-- Ví dụ dữ liệu TRƯỚC migrate:
-- MatKhauHash = "123456hash"

-- Sau migrate sẽ thành:
-- MatKhauHash = "$2a$11$..." (BCrypt hash của "123456")

PRINT 'Backup completed. Ready for BCrypt migration.'
PRINT 'Please run the C# migration endpoint to complete the process.'
