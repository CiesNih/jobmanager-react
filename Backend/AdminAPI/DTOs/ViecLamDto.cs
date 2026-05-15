using System.ComponentModel.DataAnnotations;

namespace AdminAPI.DTOs
{
    // DTO chung cho việc làm (dùng cho cả Create và Update)
    public class ViecLamDto
    {
        public Guid? MaCongTy { get; set; }
        public string? TieuDe { get; set; }
        public string? MoTa { get; set; }
        public string? YeuCau { get; set; }
        public string? TrachNhiem { get; set; }
        public string? DiaDiem { get; set; }
        public string? LoaiHinhCongViec { get; set; }
        public int? LuongToiThieu { get; set; }
        public int? LuongToiDa { get; set; }
        public DateTime? NgayHetHan { get; set; }
    }

    // DTO để tạo mới việc làm
    public class CreateViecLamDto
    {
        [Required(ErrorMessage = "Mã công ty không được để trống")]
        public Guid MaCongTy { get; set; }

        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        public string TieuDe { get; set; }

        public string? MoTa { get; set; }
        public string? YeuCau { get; set; }
        public string? TrachNhiem { get; set; }
        public string? DiaDiem { get; set; }
        public string? LoaiHinhCongViec { get; set; }
        public int? LuongToiThieu { get; set; }
        public int? LuongToiDa { get; set; }
        public DateTime NgayHetHan { get; set; }
    }

    // DTO để cập nhật việc làm
    public class UpdateViecLamDto
    {
        public string? TieuDe { get; set; }
        public string? MoTa { get; set; }
        public string? YeuCau { get; set; }
        public string? TrachNhiem { get; set; }
        public string? DiaDiem { get; set; }
        public string? LoaiHinhCongViec { get; set; }
        public int? LuongToiThieu { get; set; }
        public int? LuongToiDa { get; set; }
        public DateTime? NgayHetHan { get; set; }
    }

    // DTO để duyệt tin (Admin)
    public class DuyetViecLamDto
    {
        [Required]
        public bool DaDuyet { get; set; }

        public string? GhiChu { get; set; }
    }

    // DTO để trả về thông tin việc làm
    public class ViecLamResponseDto
    {
        public Guid MaViecLam { get; set; }
        public Guid MaCongTy { get; set; }
        public string TieuDe { get; set; }
        public string? MoTa { get; set; }
        public string? YeuCau { get; set; }
        public string? TrachNhiem { get; set; }
        public string? DiaDiem { get; set; }
        public string? LoaiHinhCongViec { get; set; }
        public int? LuongToiThieu { get; set; }
        public int? LuongToiDa { get; set; }
        public bool? DaDuyet { get; set; }
        public bool? DuocHienThi { get; set; }
        public DateTime NgayDang { get; set; }
        public DateTime NgayHetHan { get; set; }
        public int? SoLuotXem { get; set; }

        // Thông tin công ty
        public string? TenCongTy { get; set; }
        public string? LogoCongTy { get; set; }

        // Thống kê
        public int? SoLuongUngTuyen { get; set; }
    }

    // DTO cho danh sách việc làm (pagination)
    public class ViecLamListDto
    {
        public Guid MaViecLam { get; set; }
        public string TieuDe { get; set; }
        public string? DiaDiem { get; set; }
        public string? LoaiHinhCongViec { get; set; }
        public int? LuongToiThieu { get; set; }
        public int? LuongToiDa { get; set; }
        public bool? DaDuyet { get; set; }
        public string? TenCongTy { get; set; }
        public string? LogoCongTy { get; set; }
        public DateTime NgayDang { get; set; }
        public int? SoLuotXem { get; set; }
        public int? SoLuongUngTuyen { get; set; }
    }

    // DTO cho filter/search
    public class ViecLamFilterDto
    {
        public string? Keyword { get; set; }
        public string? DiaDiem { get; set; }
        public string? LoaiHinhCongViec { get; set; }
        public Guid? MaCongTy { get; set; }
        public bool? DaDuyet { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "NgayDang";
        public string? SortOrder { get; set; } = "desc";
    }

    // DTO cho pagination response
    public class PaginatedViecLamDto
    {
        public List<ViecLamListDto> Items { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
    }
}
