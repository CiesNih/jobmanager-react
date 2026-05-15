using System.ComponentModel.DataAnnotations;

namespace UngVienAPI.Models
{
    public class PhongVan
    {
        [Key]
        public Guid MaPhongVan { get; set; }
        public Guid MaDon { get; set; }
        public Guid? MaNguoiPhongVan { get; set; }
        public DateTime ThoiGian { get; set; }
        public int? ThoiLuong { get; set; }
        public string? DiaDiem { get; set; }
        public string? TrangThai { get; set; }
        public string? GhiChu { get; set; }

        // Navigation property 
        public virtual DonUngTuyen MaDonNavigation { get; set; } = null!;

    }
}
