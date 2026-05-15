using AdminAPI.DTOs;
using AdminAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AdminAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViecLamController : ControllerBase
    {
        private readonly BTLapicontext _context;

        public ViecLamController(BTLapicontext context)
        {
            _context = context;
        }

        // ========================================================
        // GET: api/ViecLam
        // Lấy danh sách tất cả việc làm (cho Admin)
        // ========================================================
        [HttpGet]
        // [Authorize(Roles = "Admin")] // Tạm thời tắt để test
        public async Task<ActionResult> GetAllViecLam(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? daDuyet = null)
        {
            try
            {
                var query = _context.ViecLams.AsNoTracking().AsQueryable();

                if (daDuyet.HasValue)
                {
                    query = query.Where(v => v.DaDuyet == daDuyet.Value);
                }

                var totalItems = await query.CountAsync();

                var viecLams = await query
                    .OrderByDescending(v => v.NgayDang)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Map sang anonymous object
                var result = viecLams.Select(v => new
                {
                    maViecLam = v.MaViecLam,
                    tieuDe = v.TieuDe,
                    moTa = v.MoTa,
                    yeuCau = v.YeuCau,
                    trachNhiem = v.TrachNhiem,
                    diaDiem = v.DiaDiem,
                    loaiHinhCongViec = v.LoaiHinhCongViec,
                    luongToiThieu = v.LuongToiThieu,
                    luongToiDa = v.LuongToiDa,
                    daDuyet = v.DaDuyet,
                    ngayDang = v.NgayDang,
                    ngayHetHan = v.NgayHetHan,
                    soLuotXem = v.SoLuotXem,
                    maCongTy = v.MaCongTy,
                    tenCongTy = "N/A" // Tạm thời không query CongTy
                }).ToList();

                return Ok(new
                {
                    success = true,
                    data = result,
                    pagination = new
                    {
                        totalItems,
                        totalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                        currentPage = page,
                        pageSize
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        // ========================================================
        // GET: api/ViecLam/{id}
        // Lấy chi tiết một việc làm
        // ========================================================
        [HttpGet("{id}")]
        public async Task<ActionResult> GetViecLamById(Guid id)
        {
            try
            {
                var viecLam = await _context.ViecLams
                    .FirstOrDefaultAsync(v => v.MaViecLam == id);

                if (viecLam == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy việc làm!" });
                }

                // Lấy tên công ty riêng
                var tenCongTy = await _context.CongTys
                    .Where(c => c.MaCongTy == viecLam.MaCongTy)
                    .Select(c => c.TenCongTy)
                    .FirstOrDefaultAsync();

                var result = new
                {
                    viecLam.MaViecLam,
                    viecLam.TieuDe,
                    viecLam.MoTa,
                    viecLam.YeuCau,
                    viecLam.TrachNhiem,
                    viecLam.DiaDiem,
                    viecLam.LoaiHinhCongViec,
                    viecLam.LuongToiThieu,
                    viecLam.LuongToiDa,
                    viecLam.DaDuyet,
                    viecLam.NgayDang,
                    viecLam.NgayHetHan,
                    viecLam.SoLuotXem,
                    viecLam.MaCongTy,
                    TenCongTy = tenCongTy ?? "Chưa cập nhật"
                };

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message });
            }
        }

        // ========================================================
        // POST: api/ViecLam
        // Tạo việc làm mới (Nhà tuyển dụng)
        // ========================================================
        [HttpPost]
        // [Authorize(Roles = "NhaTuyenDung,Admin")] // Tạm thời tắt để test
        public async Task<ActionResult> CreateViecLam([FromBody] ViecLamDto dto)
        {
            try
            {
                // Validate
                if (string.IsNullOrWhiteSpace(dto.TieuDe))
                {
                    return BadRequest(new { success = false, message = "Tiêu đề không được để trống!" });
                }

                if (dto.MaCongTy == Guid.Empty)
                {
                    return BadRequest(new { success = false, message = "Mã công ty không hợp lệ!" });
                }

                // Kiểm tra công ty tồn tại
                var congTy = await _context.CongTys.FindAsync(dto.MaCongTy);
                if (congTy == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy công ty!" });
                }

                // Tạo việc làm mới
                var viecLam = new ViecLam
                {
                    MaViecLam = Guid.NewGuid(),
                    TieuDe = dto.TieuDe,
                    MoTa = dto.MoTa,
                    YeuCau = dto.YeuCau,
                    TrachNhiem = dto.TrachNhiem,
                    DiaDiem = dto.DiaDiem,
                    LoaiHinhCongViec = dto.LoaiHinhCongViec,
                    LuongToiThieu = dto.LuongToiThieu,
                    LuongToiDa = dto.LuongToiDa,
                    MaCongTy = dto.MaCongTy.Value,
                    DaDuyet = false,
                    NgayDang = DateTime.Now,
                    NgayCapNhat = DateTime.Now,
                    NgayHetHan = dto.NgayHetHan ?? DateTime.Now.AddMonths(1),
                    SoLuotXem = 0,
                    Slug = dto.TieuDe?.ToLower().Replace(" ", "-")
                };

                _context.ViecLams.Add(viecLam);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetViecLamById), new { id = viecLam.MaViecLam },
                    new { success = true, message = "Tạo việc làm thành công!", data = viecLam });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message });
            }
        }

        // ========================================================
        // PUT: api/ViecLam/{id}
        // Cập nhật việc làm
        // ========================================================
        [HttpPut("{id}")]
        // [Authorize(Roles = "NhaTuyenDung,Admin")] // Tạm thời tắt để test
        public async Task<ActionResult> UpdateViecLam(Guid id, [FromBody] ViecLamDto dto)
        {
            try
            {
                var viecLam = await _context.ViecLams.FindAsync(id);

                if (viecLam == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy việc làm!" });
                }

                // Cập nhật thông tin
                viecLam.TieuDe = dto.TieuDe ?? viecLam.TieuDe;
                viecLam.MoTa = dto.MoTa ?? viecLam.MoTa;
                viecLam.YeuCau = dto.YeuCau ?? viecLam.YeuCau;
                viecLam.TrachNhiem = dto.TrachNhiem ?? viecLam.TrachNhiem;
                viecLam.DiaDiem = dto.DiaDiem ?? viecLam.DiaDiem;
                viecLam.LuongToiThieu = dto.LuongToiThieu ?? viecLam.LuongToiThieu;
                viecLam.LuongToiDa = dto.LuongToiDa ?? viecLam.LuongToiDa;
                viecLam.LoaiHinhCongViec = dto.LoaiHinhCongViec ?? viecLam.LoaiHinhCongViec;
                viecLam.NgayCapNhat = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Cập nhật việc làm thành công!", data = viecLam });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message });
            }
        }

        // ========================================================
        // DELETE: api/ViecLam/{id}
        // Xóa việc làm
        // ========================================================
        [HttpDelete("{id}")]
        // [Authorize(Roles = "NhaTuyenDung,Admin")] // Tạm thời tắt để test
        public async Task<ActionResult> DeleteViecLam(Guid id)
        {
            try
            {
                var viecLam = await _context.ViecLams.FindAsync(id);

                if (viecLam == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy việc làm!" });
                }

                // Kiểm tra xem có đơn ứng tuyển nào không
                var hasDonUngTuyen = await _context.DonUngTuyens.AnyAsync(d => d.MaViecLam == id);
                if (hasDonUngTuyen)
                {
                    return BadRequest(new { success = false, message = "Không thể xóa việc làm đã có đơn ứng tuyển!" });
                }

                _context.ViecLams.Remove(viecLam);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Xóa việc làm thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message });
            }
        }

        // ========================================================
        // PATCH: api/ViecLam/{id}/duyet
        // Duyệt/Từ chối việc làm (Admin)
        // ========================================================
        [HttpPatch("{id}/duyet")]
        // [Authorize(Roles = "Admin")] // Tạm thời tắt để test
        public async Task<ActionResult> DuyetViecLam(Guid id, [FromBody] DuyetViecLamDto dto)
        {
            try
            {
                var viecLam = await _context.ViecLams.FindAsync(id);

                if (viecLam == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy việc làm!" });
                }

                viecLam.DaDuyet = dto.DaDuyet;
                viecLam.NgayCapNhat = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = dto.DaDuyet ? "Duyệt việc làm thành công!" : "Từ chối việc làm!",
                    data = viecLam
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server!", error = ex.Message });
            }
        }
    }

    // DTO for approval
    public class DuyetViecLamDto
    {
        public bool DaDuyet { get; set; }
        public Guid? NguoiDuyet { get; set; }
    }
}
