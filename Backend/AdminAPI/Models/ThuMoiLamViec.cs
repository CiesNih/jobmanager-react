using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("ThuMoiLamViec")]
    public class ThuMoiLamViec
    {
        [Key]
        public Guid MaThu { get; set; }

        public Guid MaDon { get; set; }

        public string? MucLuongDeNghi { get; set; }

        public DateTime? DuyetVaoLuc { get; set; }

        public string? QuyenHanPhu { get; set; }

        public DateTime? NgayGui { get; set; }

        public DateTime? NgayHetHan { get; set; }

        // Navigation Properties
        [ForeignKey("MaDon")]
        public virtual DonUngTuyen? DonUngTuyen { get; set; }
    }
}
