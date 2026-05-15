using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("LichSuUngThang")]
    public class LichSuUngThang
    {
        [Key]
        public Guid MaLichSu { get; set; }

        public Guid MaNguoiDung { get; set; }

        public string? HanhDong { get; set; }

        public string? LoaiThucThe { get; set; }

        public Guid? MaThucThe { get; set; }

        public string? ChiTiet { get; set; }

        public DateTime? ThoiGian { get; set; }

        // Navigation Properties
        [ForeignKey("MaNguoiDung")]
        public virtual NguoiDung? NguoiDung { get; set; }
    }
}
