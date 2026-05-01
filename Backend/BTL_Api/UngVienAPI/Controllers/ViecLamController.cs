using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UngVienAPI.Models; // Đảm bảo khớp với namespace Models của bạn
using UngVienAPI.DTO;

namespace UngVienAPI.Controllers
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

        // 1. Lấy danh sách việc làm & Tìm kiếm
        // GET: api/ViecLam?search=Kế toán
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ViecLamDTO>>> GetViecLams(string? search)
        {
            // Include bảng Công Ty để lấy được tên công ty hiển thị lên UI
            var query = _context.ViecLams
                .Include(v => v.MaCongTyNavigation)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(v => v.TieuDe.Contains(search) || v.DiaDiem.Contains(search));
            }

            var result = await query.Select(v => new ViecLamDTO
            {
                MaViecLam = v.MaViecLam,
                TieuDe = v.TieuDe,
                Slug = v.Slug,
                DiaDiem = v.DiaDiem,
                LoaiHinhCongViec = v.LoaiHinhCongViec,
                LuongToiThieu = v.LuongToiThieu,
                LuongToiDa = v.LuongToiDa,
                TenCongTy = v.MaCongTyNavigation.TenCongTy,
                NgayDang = v.NgayDang,
                DaDuyet = v.DaDuyet
            }).ToListAsync();

            return Ok(result);
        }
        [HttpPost]
        public async Task<ActionResult<ViecLam>> PostViecLam(ViecLam viecLam)
        {
            viecLam.MaViecLam = Guid.NewGuid();
            viecLam.NgayTao = DateTime.Now;
            viecLam.NgayCapNhat = DateTime.Now;
            viecLam.NgayDang = DateTime.Now;

            // Tạo slug tự động nếu chưa có
            if (string.IsNullOrEmpty(viecLam.Slug))
            {
                viecLam.Slug = viecLam.TieuDe.ToLower().Replace(" ", "-") + "-" + Guid.NewGuid().ToString().Substring(0, 5);
            }

            _context.ViecLams.Add(viecLam);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetViecLams), new { id = viecLam.MaViecLam }, viecLam);
        }

        // 3. Xóa việc làm
        // DELETE: api/ViecLam/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteViecLam(Guid id)
        {
            var viecLam = await _context.ViecLams.FindAsync(id);
            if (viecLam == null)
            {
                return NotFound(new { message = "Không tìm thấy việc làm này" });
            }

            _context.ViecLams.Remove(viecLam);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
