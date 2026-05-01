using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UngVienAPI.Models
{
    [Table("Quyen")]
    public class Quyen
    {
        [Key]
        public int MaQuyen { get; set; }

        [Required, MaxLength(50)]
        public string TenQuyen { get; set; }

        public string MoTa { get; set; }

        public ICollection<NguoiDung> NguoiDungs { get; set; }
    }
}
