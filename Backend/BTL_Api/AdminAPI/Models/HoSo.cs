using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("HoSo")]
    public class HoSo
    {
        [Key]
        public Guid MaHoSo { get; set; }

        public Guid MaUngVien { get; set; }

        public string? TenFile { get; set; }

        public string? DuongDanLuuTru { get; set; }

        public string? LoaiFile { get; set; }

        public long? KichThuoc { get; set; }

        public bool? MacDinh { get; set; }

        public DateTime? NgayTaiLen { get; set; }

        public string? MaHash { get; set; }

        // Navigation Properties
        [ForeignKey("MaUngVien")]
        public virtual UngVien? UngVien { get; set; }
    }
}
