using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class ThuMoiLamViec
{
    public Guid MaOffer { get; set; }

    public Guid MaDon { get; set; }

    public Guid? MaNguoiGui { get; set; }

    public int? MucLuongDeXuat { get; set; }

    public string? DonViTienTe { get; set; }

    public string? PhucLoi { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? NgayGui { get; set; }

    public DateTime? NgayPhanHoi { get; set; }

    public virtual DonUngTuyen MaDonNavigation { get; set; } = null!;

    public virtual NguoiDung? MaNguoiGuiNavigation { get; set; }
}
