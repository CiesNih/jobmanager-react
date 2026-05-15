using System.ComponentModel.DataAnnotations;

namespace AdminAPI.DTOs
{
    // DTO cho danh sách việc làm của công ty
    public class ViecLamCuaCongTyDto
    {
        public Guid MaViecLam { get; set; }
        public string TieuDe { get; set; }
        public string? DiaDiem { get; set; }
        public string? LoaiHinhCongViec { get; set; }
        public int? LuongToiThieu { get; set; }
        public int? LuongToiDa { get; set; }
        public bool? DaDuyet { get; set; }
        public DateTime NgayDang { get; set; }
        public DateTime NgayHetHan { get; set; }
        public int? SoLuotXem { get; set; }
        public int SoLuongUngTuyen { get; set; }
    }

    // DTO cho đơn ứng tuyển (với thông tin ứng viên và hồ sơ)
    public class DonUngTuyenChiTietDto
    {
        // Thông tin đơn ứng tuyển
        public Guid MaDonUngTuyen { get; set; }
        public Guid MaViecLam { get; set; }
        public string? TenViecLam { get; set; }
        public string? TrangThai { get; set; }
        public DateTime NgayNop { get; set; }
        public DateTime NgayCapNhat { get; set; }

        // Thông tin ứng viên
        public Guid MaUngVien { get; set; }
        public string? HoTen { get; set; }
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Avatar { get; set; }
        public string? DiaChi { get; set; }
        public int? SoNamKinhNghiem { get; set; }

        // Thông tin hồ sơ
        public string? MaHoSoUngTuyen { get; set; }
        public string? DuongDanLuuTru { get; set; }

        // Thông tin phỏng vấn (nếu có)
        public bool? DaCoLichPhongVan { get; set; }
        public DateTime? ThoiGianPhongVan { get; set; }
    }

    // DTO để tạo lịch phỏng vấn
    public class TaoPhongVanDto
    {
        [Required(ErrorMessage = "Mã đơn ứng tuyển không được để trống")]
        public Guid MaDon { get; set; }

        public Guid? MaNguoiPhong { get; set; }

        [Required(ErrorMessage = "Thời gian phỏng vấn không được để trống")]
        public string ThoiGian { get; set; }

        public int? ThoiLuong { get; set; }

        public string? DiaDiem { get; set; }

        public string? GhiChu { get; set; }
    }

    // DTO response sau khi tạo phỏng vấn
    public class PhongVanResponseDto
    {
        public Guid MaPhongVan { get; set; }
        public Guid MaDon { get; set; }
        public Guid? MaNguoiPhong { get; set; }
        public string? ThoiGian { get; set; }
        public string? ThoiLuong { get; set; }
        public string? DiaDiem { get; set; }
        public string? GhiChu { get; set; }
        public DateTime NgayTao { get; set; }

        // Thông tin ứng viên
        public string? TenUngVien { get; set; }
        public string? EmailUngVien { get; set; }
        public string? SoDienThoaiUngVien { get; set; }

        // Thông tin việc làm
        public string? TenViecLam { get; set; }
    }

    // DTO cho filter đơn ứng tuyển
    public class DonUngTuyenFilterDto
    {
        public Guid? MaViecLam { get; set; }
        public string? TrangThai { get; set; }
        public string? Keyword { get; set; } // Tìm theo tên ứng viên, email
        public DateTime? TuNgay { get; set; }
        public DateTime? DenNgay { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "NgayNop";
        public string? SortOrder { get; set; } = "desc";
    }

    // DTO cho pagination đơn ứng tuyển
    public class PaginatedDonUngTuyenDto
    {
        public List<DonUngTuyenChiTietDto> Items { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
    }

    // DTO để cập nhật trạng thái đơn ứng tuyển
    public class CapNhatTrangThaiDonDto
    {
        [Required]
        public string TrangThai { get; set; } // "DaXem", "PhongVan", "TuChoi", "ChapNhan"

        public string? GhiChu { get; set; }
    }

    // DTO thống kê cho nhà tuyển dụng
    public class ThongKeNTDDto
    {
        public int TongViecLam { get; set; }
        public int ViecLamDaDuyet { get; set; }
        public int ViecLamChoDuyet { get; set; }
        public int TongDonUngTuyen { get; set; }
        public int DonMoi { get; set; }
        public int DonDaXem { get; set; }
        public int DonPhongVan { get; set; }
        public int DonChapNhan { get; set; }
        public int DonTuChoi { get; set; }
    }
}
