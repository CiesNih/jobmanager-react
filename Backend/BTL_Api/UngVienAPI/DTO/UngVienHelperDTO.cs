namespace UngVienAPI.DTO
{
    public class HoSoCreateDTO
    {
        public Guid MaUngVien { get; set; }
        public string TenFile { get; set; }
        public string DuongDanLuuTru { get; set; }
        public string LoaiFile { get; set; }
    }

    public class DonUngTuyenCreateDTO
    {
        public Guid MaUngVien { get; set; }
        public Guid MaViecLam { get; set; }
        public Guid? MaHoSo { get; set; }
        public string ThuGioiThieu { get; set; }
    }

    public class PhongVanDTO
    {
        public Guid MaPhongVan { get; set; }
        public Guid MaDon { get; set; }
        public DateTime ThoiGian { get; set; }
        public int ThoiLuong { get; set; }
        public string DiaDiem { get; set; }
        public string TrangThai { get; set; }
        public string GhiChu { get; set; }
    }

    public class ThuMoiLamViecDTO
    {
        public Guid MaOffer { get; set; }
        public Guid MaDon { get; set; }
        public int MucLuongDeXuat { get; set; }
        public string DonViTienTe { get; set; }
        public string PhucLoi { get; set; }
        public string TrangThai { get; set; }
        public DateTime NgayGui { get; set; }
        public DateTime? NgayPhanHoi { get; set; }
    }
    public class ThongBaoDTO
    {
        public Guid MaThongBao { get; set; }
        public string TieuDe { get; set; }
        public string NoiDung { get; set; }
        public bool DaXem { get; set; }
        public DateTime NgayTao { get; set; }
    }

}
