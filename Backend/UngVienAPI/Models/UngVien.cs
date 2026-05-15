using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UngVienAPI.Models
{
    [Table("UngVien")]
    public class UngVien
    {
        [Key]
        public Guid MaUngVien { get; set; }

        [ForeignKey("NguoiDung")]
        public Guid MaNguoiDung { get; set; }
        public NguoiDung NguoiDung { get; set; }

        [MaxLength(255)]
        public string TieuDeHoSo { get; set; }
        public string GioiThieu { get; set; }

        [MaxLength(255)]
        public string DiaChi { get; set; }

        public int SoNamKinhNghiem { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;

        public ICollection<HoSo> HoSos { get; set; }
        public ICollection<DonUngTuyen> DonUngTuyens { get; set; }
    }
}
