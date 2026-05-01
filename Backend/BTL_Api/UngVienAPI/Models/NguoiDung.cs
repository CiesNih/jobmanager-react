using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UngVienAPI.Models
{
    [Table("NguoiDung")]
    public class NguoiDung
    {
        [Key]
        public Guid MaNguoiDung { get; set; }

        [Required, MaxLength(255)]
        public string Email { get; set; }

        [Required]
        public string MatKhauHash { get; set; }

        [MaxLength(255)]
        public string HoTen { get; set; }

        [MaxLength(30)]
        public string SoDienThoai { get; set; }

        [MaxLength(500)]
        public string Avatar { get; set; }

        [ForeignKey("Quyen")]
        public int MaQuyen { get; set; }
        public Quyen Quyen { get; set; }

        public bool TrangThai { get; set; } = true;
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;

        public ICollection<UngVien> UngViens { get; set; }
        public ICollection<ThongBao> ThongBaos { get; set; }
    }
}
