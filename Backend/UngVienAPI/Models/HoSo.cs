using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UngVienAPI.Models
{
    [Table("HoSo")]
    public class HoSo
    {
        [Key]
        public Guid MaHoSo { get; set; }

        [ForeignKey("UngVien")]
        public Guid MaUngVien { get; set; }
        public UngVien UngVien { get; set; }

        [Required, MaxLength(255)]
        public string TenFile { get; set; }

        [Required, MaxLength(500)]
        public string DuongDanLuuTru { get; set; }

        [MaxLength(50)]
        public string LoaiFile { get; set; }

        public long? KichThuoc { get; set; }
        public bool MacDinh { get; set; } = true;
        public DateTime NgayTaiLen { get; set; } = DateTime.Now;

        [MaxLength(200)]
        public string? MaHash { get; set; }

        public ICollection<DonUngTuyen> DonUngTuyens { get; set; }
    }
}
