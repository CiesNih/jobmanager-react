using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("PhongVan")]
    public class PhongVan
    {
        [Key]
        public Guid MaPhongVan { get; set; }

        public Guid MaDon { get; set; }

        public Guid? MaNguoiPhong { get; set; }

        public DateTime? ThoiGian { get; set; }

        public int? ThoiLuong { get; set; }

        public string? DiaDiem { get; set; }

        public string? TrangThai { get; set; }

        public string? GhiChu { get; set; }

        public DateTime? NgayTao { get; set; }

        public DateTime? NgayCapNhat { get; set; }

        // Navigation Properties
        [ForeignKey("MaDon")]
        public virtual DonUngTuyen? DonUngTuyen { get; set; }
    }
}
