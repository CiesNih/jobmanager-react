using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class ViecLam
{
    public Guid MaViecLam { get; set; }

    public Guid MaCongTy { get; set; }

    public Guid? TaoBoi { get; set; }

    public string TieuDe { get; set; } = null!;

    public string? Slug { get; set; }

    public string? DiaDiem { get; set; }

    public string? LoaiHinhCongViec { get; set; }

    public string? MoTa { get; set; }

    public string? YeuCau { get; set; }

    public string? TrachNhiem { get; set; }

    public int? LuongToiThieu { get; set; }

    public int? LuongToiDa { get; set; }

    public bool? DaDuyet { get; set; }

    public bool? DuocHienThi { get; set; }

    public DateTime? NgayDang { get; set; }

    public DateTime? NgayHetHan { get; set; }

    public int? SoLuotXem { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<DonUngTuyen> DonUngTuyens { get; set; } = new List<DonUngTuyen>();

    public virtual CongTy MaCongTyNavigation { get; set; } = null!;

    public virtual NguoiDung? TaoBoiNavigation { get; set; }

    public virtual ICollection<KyNang> MaKyNangs { get; set; } = new List<KyNang>();
}
