using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("DonUngTuyen")]
    public class DonUngTuyen
    {
        [Key]
        public Guid MaDon { get; set; }

        public Guid MaViecLam { get; set; }

        public Guid MaUngVien { get; set; }

        public Guid? MaHoSo { get; set; }

        public string? ThuGioiThieu { get; set; }

        public string? TrangThai { get; set; }

        public DateTime? NgayNop { get; set; }

        public DateTime? NgayCapNhat { get; set; }

        // Navigation Properties
        [ForeignKey("MaViecLam")]
        public virtual ViecLam? ViecLam { get; set; }

        [ForeignKey("MaUngVien")]
        public virtual UngVien? UngVien { get; set; }

        [ForeignKey("MaHoSo")]
        public virtual HoSo? HoSo { get; set; }
    }
}
