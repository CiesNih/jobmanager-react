using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class NguoiDung
{
    public Guid MaNguoiDung { get; set; }

    public string Email { get; set; } = null!;

    public string MatKhauHash { get; set; } = null!;

    public string? HoTen { get; set; }

    public string? SoDienThoai { get; set; }

    public string? Avatar { get; set; }

    public int MaQuyen { get; set; }

    public bool? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<CongTy> CongTies { get; set; } = new List<CongTy>();

    public virtual ICollection<LichSuHeThong> LichSuHeThongs { get; set; } = new List<LichSuHeThong>();

    public virtual Quyen MaQuyenNavigation { get; set; } = null!;

    public virtual ICollection<PhongVan> PhongVans { get; set; } = new List<PhongVan>();

    public virtual ICollection<ThongBao> ThongBaos { get; set; } = new List<ThongBao>();

    public virtual ICollection<ThuMoiLamViec> ThuMoiLamViecs { get; set; } = new List<ThuMoiLamViec>();

    public virtual UngVien? UngVien { get; set; }

    public virtual ICollection<ViecLam> ViecLams { get; set; } = new List<ViecLam>();
}
