using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class HoSo
{
    public Guid MaHoSo { get; set; }

    public Guid MaUngVien { get; set; }

    public string TenFile { get; set; } = null!;

    public string DuongDanLuuTru { get; set; } = null!;

    public string? LoaiFile { get; set; }

    public long? KichThuoc { get; set; }

    public bool? MacDinh { get; set; }

    public DateTime? NgayTaiLen { get; set; }

    public string? MaHash { get; set; }

    public virtual ICollection<DonUngTuyen> DonUngTuyens { get; set; } = new List<DonUngTuyen>();

    public virtual UngVien MaUngVienNavigation { get; set; } = null!;
}
