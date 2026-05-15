using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminAPI.Models
{
    [Table("ViecLam_KyNang")]
    public class ViecLamKyNang
    {
        public Guid MaViecLam { get; set; }

        public Guid MaKyNang { get; set; }

        // Navigation Properties
        [ForeignKey("MaViecLam")]
        public virtual ViecLam? ViecLam { get; set; }

        [ForeignKey("MaKyNang")]
        public virtual KyNang? KyNang { get; set; }
    }
}
