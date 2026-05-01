using System.ComponentModel.DataAnnotations;

namespace UngVienAPI.Models
{
    public class CongTy
    {
        [Key]
        public Guid MaCongTy { get; set; }
        public string TenCongTy { get; set; }
        public string Slug { get; set; }
        public string Website { get; set; }
        public string MoTa { get; set; }
        public string Logo { get; set; }
        public Guid? TaoBoi { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }

        // Navigation property: 1 công ty có nhiều việc làm
        public ICollection<ViecLam> ViecLams { get; set; }
    }
}
