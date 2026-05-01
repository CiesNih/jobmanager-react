using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class Quyen
{
    public int MaQuyen { get; set; }

    public string TenQuyen { get; set; } = null!;

    public string? MoTa { get; set; }

    public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();
}
