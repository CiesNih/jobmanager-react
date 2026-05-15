using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("ThongBao")]
    public class ThongBao
    {
        [Key]
        public Guid MaThongBao { get; set; }

        public Guid MaNguoiNhan { get; set; }

        public string TieuDe { get; set; } = string.Empty;

        public string? NoiDung { get; set; }

        public bool? DaXem { get; set; }

        public DateTime? NgayTao { get; set; }

        // Navigation Properties
        [ForeignKey("MaNguoiNhan")]
        public virtual NguoiDung? NguoiNhan { get; set; }
    }
}
