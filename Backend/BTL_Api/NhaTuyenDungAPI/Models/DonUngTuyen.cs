using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class DonUngTuyen
{
    public Guid MaDon { get; set; }

    public Guid MaViecLam { get; set; }

    public Guid MaUngVien { get; set; }

    public Guid? MaHoSo { get; set; }

    public string? ThuGioiThieu { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? NgayNop { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual HoSo? MaHoSoNavigation { get; set; }

    public virtual UngVien MaUngVienNavigation { get; set; } = null!;

    public virtual ViecLam MaViecLamNavigation { get; set; } = null!;

    public virtual ICollection<PhongVan> PhongVans { get; set; } = new List<PhongVan>();

    public virtual ThuMoiLamViec? ThuMoiLamViec { get; set; }
}
