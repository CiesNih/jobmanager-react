using System.ComponentModel.DataAnnotations;

namespace UngVienAPI.Models
{
    public class ThuMoiLamViec
    {
        [Key]
        public Guid MaOffer { get; set; }
        public Guid MaDon { get; set; }
        public Guid? MaNguoiGui { get; set; }
        public int? MucLuongDeXuat { get; set; }
        public string? DonViTienTe { get; set; }
        public string? PhucLoi { get; set; }
        public string? TrangThai { get; set; }
        public DateTime? NgayGui { get; set; }
        public DateTime? NgayPhanHoi { get; set; }
    }
}
