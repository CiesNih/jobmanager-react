using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("UngVien")]
    public class UngVien
    {
        [Key]
        public Guid MaUngVien { get; set; }

        public Guid MaNguoiDung { get; set; }

        public string? TieuDeHoSo { get; set; }

        public string? GioiThieu { get; set; }

        public string? DiaChi { get; set; }

        public int? SoNamKinhNghiem { get; set; }

        public DateTime? NgayTao { get; set; }

        public DateTime? NgayCapNhat { get; set; }

        // Navigation Properties
        [ForeignKey("MaNguoiDung")]
        public virtual NguoiDung? NguoiDung { get; set; }

        public virtual ICollection<DonUngTuyen>? DonUngTuyens { get; set; }
        
        public virtual ICollection<HoSo>? HoSos { get; set; }
    }
}
