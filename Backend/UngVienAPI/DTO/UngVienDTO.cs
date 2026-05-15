namespace UngVienAPI.DTO
{
    public class UngVienDTO
    {
        public Guid MaUngVien { get; set; }
        public Guid MaNguoiDung { get; set; }
        public string TieuDeHoSo { get; set; }
        public string GioiThieu { get; set; }
        public string DiaChi { get; set; }
        public int SoNamKinhNghiem { get; set; }

        public List<HoSoDTO> HoSos { get; set; }
        public List<DonUngTuyenDTO> DonUngTuyens { get; set; }
    }
    public class HoSoDTO
    {
        public Guid MaHoSo { get; set; }
        public string TenFile { get; set; }
        public string DuongDanLuuTru { get; set; }
        public string LoaiFile { get; set; }
    }
    public class DonUngTuyenDTO
    {
        public Guid MaDon { get; set; } 
        public Guid MaViecLam { get; set; }
        public string TrangThai { get; set; }
        public string ThuGioiThieu { get; set; }
    }
}
