namespace UngVienAPI.DTO
{
    public class ViecLamDTO
    {
        public Guid MaViecLam { get; set; }
        public string TieuDe { get; set; }
        public string Slug { get; set; }
        public string DiaDiem { get; set; }
        public string LoaiHinhCongViec { get; set; }
        public int? LuongToiThieu { get; set; }
        public int? LuongToiDa { get; set; }
        public string TenCongTy { get; set; } 
        public DateTime? NgayDang { get; set; }
        public bool? DaDuyet { get; set; }
    }
}
