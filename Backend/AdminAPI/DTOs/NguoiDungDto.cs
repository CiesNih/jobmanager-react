namespace AdminAPI.DTOs
{
    public class NguoiDungDto
    {
        public Guid MaNguoiDung { get; set; }
        public string Email { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public int MaQuyen { get; set; }
        // public string TenQuyen { get; set; } = string.Empty; 
        public bool TrangThai { get; set; }
        public DateTime? NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }
    }
    // DTO dùng khi Admin thêm người dùng mới
    public class CreateNguoiDungDto
    {
        public string Email { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public int MaQuyen { get; set; }
        public bool TrangThai { get; set; } = true; // Mặc định là true (Đang hoạt động)
    }
    public class UpdateNguoiDungDto
    {
        public string HoTen { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public int MaQuyen { get; set; }
        public bool TrangThai { get; set; }
    }
}
