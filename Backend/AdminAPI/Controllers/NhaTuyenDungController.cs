using AdminAPI.DTOs;
using AdminAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AdminAPI.Controllers
{
    [Route("api/ntd")]
    [ApiController]
    // [Authorize(Roles = "NhaTuyenDung")] // Tạm thời tắt để test
    public class NhaTuyenDungController : ControllerBase
    {
        private readonly BTLapicontext _context;

        public NhaTuyenDungController(BTLapicontext context)
        {
            _context = context;
        }

        
        [HttpGet("vieclam")]
        public async Task<ActionResult<List<ViecLamCuaCongTyDto>>> GetViecLamCuaCongTy(
            [FromQuery] Guid? maCongTy,
            [FromQuery] bool? daDuyet,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                if (!maCongTy.HasValue)
                {
                    return BadRequest(new { success = false, message = "Vui lòng cung cấp mã công ty!" });
                }

                // Query việc làm của công ty
                var query = _context.ViecLams
                    .AsNoTracking()
                    .Where(v => v.MaCongTy == maCongTy.Value)
                    .AsQueryable();

                // Filter theo trạng thái duyệt
                if (daDuyet.HasValue)
                {
                    query = query.Where(v => v.DaDuyet == daDuyet.Value);
                }

                // Đếm tổng số
                var totalItems = await query.CountAsync();

                // Lấy danh sách với pagination
                var viecLams = await query
                    .OrderByDescending(v => v.NgayDang)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Map sang DTO
                var result = viecLams.Select(v => new ViecLamCuaCongTyDto
                {
                    MaViecLam = v.MaViecLam,
                    TieuDe = v.TieuDe ?? "",
                    DiaDiem = v.DiaDiem,
                    LoaiHinhCongViec = v.LoaiHinhCongViec,
                    LuongToiThieu = v.LuongToiThieu,
                    LuongToiDa = v.LuongToiDa,
                    DaDuyet = v.DaDuyet,
                    NgayDang = (DateTime)v.NgayDang,
                    NgayHetHan = (DateTime)v.NgayHetHan,
                    SoLuotXem = v.SoLuotXem,
                    SoLuongUngTuyen = 0 // Tạm thời set = 0, sẽ query riêng nếu cần
                }).ToList();

                return Ok(new
                {
                    success = true,
                    data = result,
                    pagination = new
                    {
                        totalItems = totalItems,
                        totalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                        currentPage = page,
                        pageSize = pageSize
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        
        [HttpGet("don-ung-tuyen")]
        public async Task<ActionResult<PaginatedDonUngTuyenDto>> GetDonUngTuyen(
            [FromQuery] DonUngTuyenFilterDto filter)
        {
            try
            {
                // Tạm thời bỏ qua check user để test
                // var userId = GetCurrentUserId();
                // if (userId == Guid.Empty)
                // {
                //     return Unauthorized(new { success = false, message = "Không xác định được người dùng!" });
                // }

                // Query đơn ứng tuyển của các việc làm thuộc công ty
                // Giả sử filter.MaViecLam hoặc lấy tất cả việc của công ty
                var query = _context.DonUngTuyens
                    .Include(d => d.ViecLam)
                    .Include(d => d.UngVien)
                        .ThenInclude(u => u!.NguoiDung)
                    .Include(d => d.HoSo)
                    .AsQueryable();

                // Filter theo việc làm cụ thể
                if (filter.MaViecLam.HasValue)
                {
                    query = query.Where(d => d.MaViecLam == filter.MaViecLam.Value);
                }
                else
                {
                   
                    return BadRequest(new { success = false, message = "Vui lòng cung cấp mã việc làm hoặc mã công ty!" });
                }

                // Filter theo trạng thái
                if (!string.IsNullOrWhiteSpace(filter.TrangThai))
                {
                    query = query.Where(d => d.TrangThai == filter.TrangThai);
                }

                // Filter theo keyword (tên, email ứng viên)
                if (!string.IsNullOrWhiteSpace(filter.Keyword))
                {
                    query = query.Where(d =>
                        (d.UngVien != null && d.UngVien.NguoiDung != null && d.UngVien.NguoiDung.HoTen != null && d.UngVien.NguoiDung.HoTen.Contains(filter.Keyword)) ||
                        (d.UngVien != null && d.UngVien.NguoiDung != null && d.UngVien.NguoiDung.Email != null && d.UngVien.NguoiDung.Email.Contains(filter.Keyword)));
                }

                // Filter theo ngày
                if (filter.TuNgay.HasValue)
                {
                    query = query.Where(d => d.NgayNop >= filter.TuNgay.Value);
                }

                if (filter.DenNgay.HasValue)
                {
                    query = query.Where(d => d.NgayNop <= filter.DenNgay.Value);
                }

                // Đếm tổng số
                var totalItems = await query.CountAsync();

                // Sorting
                query = filter.SortBy?.ToLower() switch
                {
                    "hoten" => filter.SortOrder == "asc" ? query.OrderBy(d => d.UngVien!.NguoiDung!.HoTen) : query.OrderByDescending(d => d.UngVien!.NguoiDung!.HoTen),
                    "trangthai" => filter.SortOrder == "asc" ? query.OrderBy(d => d.TrangThai) : query.OrderByDescending(d => d.TrangThai),
                    _ => filter.SortOrder == "asc" ? query.OrderBy(d => d.NgayNop) : query.OrderByDescending(d => d.NgayNop)
                };

                // Pagination và mapping
                var donUngTuyens = await query
                    .Skip((filter.Page - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .Select(d => new DonUngTuyenChiTietDto
                    {
                        // Thông tin đơn
                        MaDonUngTuyen = d.MaDon,
                        MaViecLam = d.MaViecLam,
                        TenViecLam = d.ViecLam != null ? d.ViecLam.TieuDe : null,
                        TrangThai = d.TrangThai,
                        NgayNop = (DateTime)d.NgayNop,
                        NgayCapNhat = (DateTime)d.NgayCapNhat,

                        // Thông tin ứng viên
                        MaUngVien = d.MaUngVien,
                        HoTen = d.UngVien != null && d.UngVien.NguoiDung != null ? d.UngVien.NguoiDung.HoTen : null,
                        Email = d.UngVien != null && d.UngVien.NguoiDung != null ? d.UngVien.NguoiDung.Email : null,
                        SoDienThoai = d.UngVien != null && d.UngVien.NguoiDung != null ? d.UngVien.NguoiDung.SoDienThoai : null,
                        Avatar = d.UngVien != null && d.UngVien.NguoiDung != null ? d.UngVien.NguoiDung.Avatar : null,
                        DiaChi = d.UngVien != null ? d.UngVien.DiaChi : null,
                        SoNamKinhNghiem = d.UngVien != null ? d.UngVien.SoNamKinhNghiem : null,

                        // Thông tin hồ sơ
                        MaHoSoUngTuyen = d.MaHoSo.HasValue ? d.MaHoSo.Value.ToString() : null,
                        DuongDanLuuTru = d.HoSo != null ? d.HoSo.DuongDanLuuTru : null,

                        // Thông tin phỏng vấn
                        DaCoLichPhongVan = false,
                        ThoiGianPhongVan = null
                    })
                    .ToListAsync();

                // Check lịch phỏng vấn
                foreach (var don in donUngTuyens)
                {
                    var phongVan = await _context.PhongVans
                        .Where(pv => pv.MaDon == don.MaDonUngTuyen)
                        .OrderByDescending(pv => pv.NgayTao)
                        .FirstOrDefaultAsync();

                    if (phongVan != null)
                    {
                        don.DaCoLichPhongVan = true;
                        don.ThoiGianPhongVan = phongVan.ThoiGian;
                    }
                }

                var result = new PaginatedDonUngTuyenDto
                {
                    Items = donUngTuyens,
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize),
                    CurrentPage = filter.Page,
                    PageSize = filter.PageSize
                };

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message });
            }
        }

        // ========================================================
        // 3. TẠO LỊCH PHỎNG VẤN
        // ========================================================

        /// <summary>
        /// Tạo lịch phỏng vấn mới cho một đơn ứng tuyển
        /// POST /api/ntd/phong-van
        /// </summary>
        [HttpPost("phong-van")]
        public async Task<ActionResult<PhongVanResponseDto>> TaoLichPhongVan([FromBody] TaoPhongVanDto dto)
        {
            try
            {
                // Tạm thời bỏ qua check user để test
                // var userId = GetCurrentUserId();
                // if (userId == Guid.Empty)
                // {
                //     return Unauthorized(new { success = false, message = "Không xác định được người dùng!" });
                // }

                // Kiểm tra đơn ứng tuyển tồn tại
                var donUngTuyen = await _context.DonUngTuyens
                    .Include(d => d.ViecLam)
                    .Include(d => d.UngVien)
                        .ThenInclude(u => u.NguoiDung)
                    .FirstOrDefaultAsync(d => d.MaDon == dto.MaDon);

                if (donUngTuyen == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy đơn ứng tuyển!" });
                }

                // Kiểm tra quyền: Chỉ tạo lịch phỏng vấn cho đơn của công ty mình
                // (Cần logic kiểm tra user có quyền quản lý công ty này không)
                // Tạm thời bỏ qua check này

                // Kiểm tra đã có lịch phỏng vấn chưa
                var existingPhongVan = await _context.PhongVans
                    .Where(pv => pv.MaDon == dto.MaDon)
                    .FirstOrDefaultAsync();

                if (existingPhongVan != null)
                {
                    return BadRequest(new { success = false, message = "Đơn này đã có lịch phỏng vấn! Vui lòng cập nhật thay vì tạo mới." });
                }

                // Tạo lịch phỏng vấn mới
                var phongVan = new PhongVan
                {
                    MaPhongVan = Guid.NewGuid(),
                    MaDon = dto.MaDon,
                    MaNguoiPhong = dto.MaNguoiPhong,
                    ThoiGian = DateTime.TryParse(dto.ThoiGian, out DateTime tg) ? tg : null,
                    ThoiLuong = dto.ThoiLuong,
                    DiaDiem = dto.DiaDiem,
                    GhiChu = dto.GhiChu,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };

                _context.PhongVans.Add(phongVan);

                // Cập nhật trạng thái đơn ứng tuyển thành "PhongVan"
                donUngTuyen.TrangThai = "PhongVan";
                donUngTuyen.NgayCapNhat = DateTime.Now;

                await _context.SaveChangesAsync();

                // Tạo response
                var response = new PhongVanResponseDto
                {
                    MaPhongVan = phongVan.MaPhongVan,
                    MaDon = phongVan.MaDon,
                    MaNguoiPhong = phongVan.MaNguoiPhong,
                    ThoiGian = phongVan.ThoiGian?.ToString("yyyy-MM-dd HH:mm:ss"),
                    ThoiLuong = phongVan.ThoiLuong?.ToString(),
                    DiaDiem = phongVan.DiaDiem,
                    GhiChu = phongVan.GhiChu,
                    NgayTao = (DateTime)phongVan.NgayTao,
                    TenUngVien = donUngTuyen.UngVien?.NguoiDung?.HoTen,
                    EmailUngVien = donUngTuyen.UngVien?.NguoiDung?.Email,
                    SoDienThoaiUngVien = donUngTuyen.UngVien?.NguoiDung?.SoDienThoai,
                    TenViecLam = donUngTuyen.ViecLam?.TieuDe
                };

                // TODO: Gửi email/thông báo cho ứng viên về lịch phỏng vấn
                // await _emailService.SendPhongVanNotification(donUngTuyen.Email, response);

                return CreatedAtAction(nameof(GetPhongVanDetail), new { id = phongVan.MaPhongVan },
                    new { success = true, message = "Tạo lịch phỏng vấn thành công!", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message });
            }
        }

        // ========================================================
        // BONUS: CÁC ENDPOINT BỔ SUNG
        // ========================================================

        /// <summary>
        /// Lấy chi tiết lịch phỏng vấn
        /// GET /api/ntd/phong-van/{id}
        /// </summary>
        [HttpGet("phong-van/{id}")]
        public async Task<ActionResult<PhongVanResponseDto>> GetPhongVanDetail(Guid id)
        {
            try
            {
                var phongVan = await _context.PhongVans
                    .Include(pv => pv.DonUngTuyen)
                        .ThenInclude(d => d.ViecLam)
                    .FirstOrDefaultAsync(pv => pv.MaPhongVan == id);

                if (phongVan == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy lịch phỏng vấn!" });
                }

                var response = new PhongVanResponseDto
                {
                    MaPhongVan = phongVan.MaPhongVan,
                    MaDon = phongVan.MaDon,
                    MaNguoiPhong = phongVan.MaNguoiPhong,
                    ThoiGian = phongVan.ThoiGian?.ToString("yyyy-MM-dd HH:mm:ss"),
                    ThoiLuong = phongVan.ThoiLuong?.ToString(),
                    DiaDiem = phongVan.DiaDiem,
                    GhiChu = phongVan.GhiChu,
                    NgayTao = (DateTime)phongVan.NgayTao,
                    TenUngVien = phongVan.DonUngTuyen?.UngVien?.NguoiDung?.HoTen,
                    EmailUngVien = phongVan.DonUngTuyen?.UngVien?.NguoiDung?.Email,
                    SoDienThoaiUngVien = phongVan.DonUngTuyen?.UngVien?.NguoiDung?.SoDienThoai,
                    TenViecLam = phongVan.DonUngTuyen?.ViecLam?.TieuDe
                };

                return Ok(new { success = true, data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message });
            }
        }

        /// <summary>
        /// Cập nhật trạng thái đơn ứng tuyển
        /// PATCH /api/ntd/don-ung-tuyen/{id}/trang-thai
        /// </summary>
        [HttpPatch("don-ung-tuyen/{id}/trang-thai")]
        public async Task<IActionResult> CapNhatTrangThaiDon(Guid id, [FromBody] CapNhatTrangThaiDonDto dto)
        {
            try
            {
                var donUngTuyen = await _context.DonUngTuyens.FindAsync(id);

                if (donUngTuyen == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy đơn ứng tuyển!" });
                }

                // Validate trạng thái
                var validStatuses = new[] { "DaNop", "DaXem", "PhongVan", "TuChoi", "ChapNhan" };
                if (!validStatuses.Contains(dto.TrangThai))
                {
                    return BadRequest(new { success = false, message = "Trạng thái không hợp lệ!" });
                }

                donUngTuyen.TrangThai = dto.TrangThai;
                donUngTuyen.NgayCapNhat = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Cập nhật trạng thái thành công!", data = donUngTuyen });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message });
            }
        }

        /// <summary>
        /// Thống kê cho nhà tuyển dụng
        /// GET /api/ntd/thong-ke
        /// </summary>
        [HttpGet("thong-ke")]
        public async Task<ActionResult<ThongKeNTDDto>> GetThongKe([FromQuery] Guid maCongTy)
        {
            try
            {
                if (maCongTy == Guid.Empty)
                {
                    return BadRequest(new { success = false, message = "Vui lòng cung cấp mã công ty!" });
                }

                var viecLams = await _context.ViecLams
                    .AsNoTracking()
                    .Where(v => v.MaCongTy == maCongTy)
                    .Select(v => new { v.MaViecLam, v.DaDuyet })
                    .ToListAsync();

                var maViecLams = viecLams.Select(v => v.MaViecLam).ToList();

                var donUngTuyens = await _context.DonUngTuyens
                    .AsNoTracking()
                    .Where(d => maViecLams.Contains(d.MaViecLam))
                    .Select(d => new { d.TrangThai })
                    .ToListAsync();

                var thongKe = new ThongKeNTDDto
                {
                    TongViecLam = viecLams.Count,
                    ViecLamDaDuyet = viecLams.Count(v => v.DaDuyet == true),
                    ViecLamChoDuyet = viecLams.Count(v => v.DaDuyet == false || v.DaDuyet == null),
                    TongDonUngTuyen = donUngTuyens.Count,
                    DonMoi = donUngTuyens.Count(d => d.TrangThai == "DaNop"),
                    DonDaXem = donUngTuyens.Count(d => d.TrangThai == "DaXem"),
                    DonPhongVan = donUngTuyens.Count(d => d.TrangThai == "PhongVan"),
                    DonChapNhan = donUngTuyens.Count(d => d.TrangThai == "ChapNhan"),
                    DonTuChoi = donUngTuyens.Count(d => d.TrangThai == "TuChoi")
                };

                return Ok(new { success = true, data = thongKe });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message });
            }
        }

        // ========================================================
        // HELPER METHODS
        // ========================================================

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
        }
    }
}
