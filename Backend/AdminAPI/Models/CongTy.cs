using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("CongTy")]
    public class CongTy
    {
        
        [Key]
        public Guid MaCongTy { get; set; }
        public string TenCongTy { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? Logo { get; set; }

        public Guid? TaoBoi { get; set; }
        public DateTime? NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }

        // Navigation Properties đã bị xóa để tránh xung đột
    }
}
