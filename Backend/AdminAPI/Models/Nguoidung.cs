using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("NguoiDung")]
    public class NguoiDung
    {
        [Key]
        public Guid MaNguoiDung { get; set; }

        public string Email { get; set; } = string.Empty;

        public string? MatKhauHash { get; set; }

        public string? HoTen { get; set; }

        public string? SoDienThoai { get; set; }

        public string? Avatar { get; set; }

        public int? MaQuyen { get; set; }

        public bool? TrangThai { get; set; }

        public DateTime? NgayTao { get; set; }

        public DateTime? NgayCapNhat { get; set; }

        // Navigation Properties
        [ForeignKey("MaQuyen")]
        public virtual Quyen? MaQuyenNavigation { get; set; }
        
        public virtual ICollection<UngVien>? UngViens { get; set; }
        public virtual ICollection<ThongBao>? ThongBaos { get; set; }
    }
}
