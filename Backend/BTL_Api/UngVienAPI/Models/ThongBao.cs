using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UngVienAPI.Models
{
    [Table("ThongBao")]
    public class ThongBao
    {
        [Key]
        public Guid MaThongBao { get; set; }
        public Guid MaNguoiNhan { get; set; }
        public string? TieuDe { get; set; }
        public string? NoiDung { get; set; }
        public string? DuongDan { get; set; }
        public bool? DaXem { get; set; }
        public DateTime? NgayTao { get; set; } = DateTime.Now;
        public virtual NguoiDung NguoiDung { get; set; } = null!;
    }
}
