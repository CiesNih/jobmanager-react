using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AdminAPI.Models
{
    public class Quyen
    {
        [Key] 
        public int MaQuyen { get; set; }

        public string TenQuyen { get; set; } = string.Empty;

        public string MoTa {  get; set; } = string.Empty;

        // 1 quyền có nhiều người dùng
        public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();
    }
}
