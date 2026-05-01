using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class ThongBao
{
    public Guid MaThongBao { get; set; }

    public Guid MaNguoiNhan { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public string? DuongDan { get; set; }

    public bool? DaXem { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual NguoiDung MaNguoiNhanNavigation { get; set; } = null!;
}
