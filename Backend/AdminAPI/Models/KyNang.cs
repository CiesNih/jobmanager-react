using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("KyNang")]
    public class KyNang
    {
        [Key]
        public Guid MaKyNang { get; set; }

        public string TenKyNang { get; set; } = string.Empty;

        // Navigation Properties - Many-to-Many với ViecLam qua ViecLam_KyNang
    }
}
