using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class LichSuHeThong
{
    public long MaLog { get; set; }

    public Guid? MaNguoiTacDong { get; set; }

    public string? HanhDong { get; set; }

    public string? LoaiThucThe { get; set; }

    public string? MaThucThe { get; set; }

    public string? ChiTiet { get; set; }

    public DateTime? ThoiGian { get; set; }

    public virtual NguoiDung? MaNguoiTacDongNavigation { get; set; }
}
