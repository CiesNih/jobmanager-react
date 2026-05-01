using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class PhongVan
{
    public Guid MaPhongVan { get; set; }

    public Guid MaDon { get; set; }

    public Guid? MaNguoiPhongVan { get; set; }

    public DateTime ThoiGian { get; set; }

    public int? ThoiLuong { get; set; }

    public string? DiaDiem { get; set; }

    public string? TrangThai { get; set; }

    public string? GhiChu { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual DonUngTuyen MaDonNavigation { get; set; } = null!;

    public virtual NguoiDung? MaNguoiPhongVanNavigation { get; set; }
}
