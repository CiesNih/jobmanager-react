using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class UngVien
{
    public Guid MaUngVien { get; set; }

    public Guid MaNguoiDung { get; set; }

    public string? TieuDeHoSo { get; set; }

    public string? GioiThieu { get; set; }

    public string? DiaChi { get; set; }

    public int? SoNamKinhNghiem { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<DonUngTuyen> DonUngTuyens { get; set; } = new List<DonUngTuyen>();

    public virtual ICollection<HoSo> HoSos { get; set; } = new List<HoSo>();

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
