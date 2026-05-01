using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("ViecLam")]
    public class ViecLam
    {
        [Key]
        [Column("MaViecLam")]
        public Guid MaViecLam { get; set; }

        [Column("MaCongTy")]
        public Guid MaCongTy { get; set; }

        [Column("TaoBoi")]
        public Guid? TaoBoi { get; set; }

        [Column("TieuDe")]
        public string TieuDe { get; set; } = string.Empty;

        [Column("Slug")]
        public string? Slug { get; set; }

        [Column("DiaDiem")]
        public string? DiaDiem { get; set; }

        [Column("LoaiHinhCongViec")]
        public string? LoaiHinhCongViec { get; set; }

        [Column("MoTa")]
        public string? MoTa { get; set; }

        [Column("YeuCau")]
        public string? YeuCau { get; set; }

        [Column("TrachNhiem")]
        public string? TrachNhiem { get; set; }

        [Column("LuongToiThieu")]
        public int? LuongToiThieu { get; set; }

        [Column("LuongToiDa")]
        public int? LuongToiDa { get; set; }

        [Column("DaDuyet")]
        public bool? DaDuyet { get; set; }

        [Column("DuocHienThi")]
        public bool? DuocHienThi { get; set; }

        [Column("NgayDang")]
        public DateTime? NgayDang { get; set; }

        [Column("NgayHetHan")]
        public DateTime? NgayHetHan { get; set; }

        [Column("SoLuotXem")]
        public int? SoLuotXem { get; set; }

        [Column("NgayTao")]
        public DateTime? NgayTao { get; set; }

        [Column("NgayCapNhat")]
        public DateTime? NgayCapNhat { get; set; }

        // Navigation Properties đã bị xóa để tránh xung đột với Entity Framework
    }
}
