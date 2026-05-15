using System;
using System.Collections.Generic;

namespace NhaTuyenDungAPI.Models;

public partial class CongTy
{
    public Guid MaCongTy { get; set; }

    public string TenCongTy { get; set; } = null!;

    public string? Slug { get; set; }

    public string? Website { get; set; }

    public string? MoTa { get; set; }

    public string? Logo { get; set; }

    public Guid? TaoBoi { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual NguoiDung? TaoBoiNavigation { get; set; }

    public virtual ICollection<ViecLam> ViecLams { get; set; } = new List<ViecLam>();
}
