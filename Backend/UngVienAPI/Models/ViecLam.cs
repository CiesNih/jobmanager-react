using System.ComponentModel.DataAnnotations;

namespace UngVienAPI.Models
{
    public class ViecLam
    {
        [Key]
        public Guid MaViecLam { get; set; }
        public Guid MaCongTy { get; set; }
        public Guid? TaoBoi { get; set; }
        public string TieuDe { get; set; }
        public string Slug { get; set; }
        public string DiaDiem { get; set; }
        public string LoaiHinhCongViec { get; set; }
        public string MoTa { get; set; }
        public string YeuCau { get; set; }
        public string TrachNhiem { get; set; }
        public int? LuongToiThieu { get; set; }
        public int? LuongToiDa { get; set; }
        public bool DaDuyet { get; set; }
        public bool DuocHienThi { get; set; }
        public DateTime NgayDang { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public int SoLuotXem { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }

        // Navigation properties
        public CongTy CongTy { get; set; }
        public virtual CongTy MaCongTyNavigation { get; set; } = null!;
        public NguoiDung TaoBoiNguoiDung { get; set; }
        public virtual ICollection<DonUngTuyen> DonUngTuyens { get; set; }
    }
}
