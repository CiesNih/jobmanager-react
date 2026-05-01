using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UngVienAPI.Models
{
    [Table("DonUngTuyen")]
    public class DonUngTuyen
    {
        [Key]
        public Guid MaDon { get; set; }

        [ForeignKey("ViecLam")]
        public Guid MaViecLam { get; set; }
        public virtual ViecLam MaViecLamNavigation { get; set; } = null!;
        [ForeignKey("UngVien")]
        public Guid MaUngVien { get; set; }
        public UngVien UngVien { get; set; }

        [ForeignKey("HoSo")]
        public Guid? MaHoSo { get; set; }
        public HoSo HoSo { get; set; }

        public string ThuGioiThieu { get; set; }

        [MaxLength(50)]
        public string TrangThai { get; set; } = "applied";

        public DateTime NgayNop { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;

        public virtual ICollection<PhongVan> PhongVans { get; set; } = new List<PhongVan>();
    }   
}
    