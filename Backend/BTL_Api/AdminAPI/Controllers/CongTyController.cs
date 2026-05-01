using AdminAPI.Models;
using AdminAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Authorization;


namespace AdminAPI.Controllers
{
    [Table("CongTy")]
    [Route("api/[controller]")]
    [ApiController]
    public class CongTyController : ControllerBase
    {
        private readonly BTLapicontext _context;

        public CongTyController(BTLapicontext context)
        {
            _context = context;
        }

        // 1. LẤY TẤT CẢ CÔNG TY (Có sắp xếp mới nhất lên đầu)
        [HttpGet]
        [AllowAnonymous] // Cho phép truy cập công khai
        public async Task<ActionResult<IEnumerable<CongTy>>> GetCongTys()
        {
            return await _context.CongTys.OrderByDescending(c => c.NgayTao).ToListAsync();
        }

        // 2. LẤY CHI TIẾT THEO ID
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CongTy>> GetCongTy(Guid id)
        {
            var congTy = await _context.CongTys.FindAsync(id);
            if (congTy == null) return NotFound(new { success = false, message = "Không tìm thấy công ty!" });
            return congTy;
        }

        // 3. LẤY CHI TIẾT THEO SLUG (Dùng cho React chuyển trang theo tên công ty)
        [HttpGet("slug/{slug}")]
        [AllowAnonymous]
        public async Task<ActionResult<CongTy>> GetBySlug(string slug)
        {
            var congTy = await _context.CongTys.FirstOrDefaultAsync(c => c.Slug == slug);
            if (congTy == null) return NotFound(new { success = false, message = "Không tìm thấy công ty!" });
            return congTy;
        }

        // 4. THÊM MỚI CÔNG TY
        [HttpPost]
        [Authorize(Roles = "Admin,NhaTuyenDung")] // Chỉ Admin và NhaTuyenDung được tạo
        public async Task<ActionResult<CongTy>> CreateCongTy(CongTyDto dto)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(dto.TenCongTy))
            {
                return BadRequest(new { success = false, message = "Tên công ty không được để trống!" });
            }

            var congTy = new CongTy
            {
                MaCongTy = Guid.NewGuid(),
                TenCongTy = dto.TenCongTy,
                Slug = GenerateSlug(dto.TenCongTy),
                Website = dto.Website,
                MoTa = dto.MoTa,
                Logo = dto.Logo,
                TaoBoi = dto.TaoBoi,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            _context.CongTys.Add(congTy);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCongTy), new { id = congTy.MaCongTy }, new 
            { 
                success = true, 
                message = "Tạo công ty thành công!",
                data = congTy 
            });
        }

        // 5. CẬP NHẬT THÔNG TIN CÔNG TY
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,NhaTuyenDung")]
        public async Task<IActionResult> UpdateCongTy(Guid id, CongTyDto dto)
        {
            var congTy = await _context.CongTys.FindAsync(id);
            if (congTy == null) return NotFound(new { success = false, message = "Không tìm thấy công ty!" });

            congTy.TenCongTy = dto.TenCongTy;
            congTy.Slug = GenerateSlug(dto.TenCongTy);
            congTy.Website = dto.Website;
            congTy.MoTa = dto.MoTa;
            congTy.Logo = dto.Logo;
            congTy.NgayCapNhat = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CongTyExists(id)) return NotFound(new { success = false, message = "Công ty không tồn tại!" });
                else throw;
            }

            return Ok(new { success = true, message = "Cập nhật thành công!", data = congTy });
        }

        // 6. XÓA CÔNG TY
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới được xóa
        public async Task<IActionResult> DeleteCongTy(Guid id)
        {
            var congTy = await _context.CongTys.FindAsync(id);
            if (congTy == null) return NotFound(new { success = false, message = "Không tìm thấy công ty!" });

            _context.CongTys.Remove(congTy);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đã xóa công ty thành công!" });
        }

        // HÀM PHỤ TRỢ: Kiểm tra tồn tại
        private bool CongTyExists(Guid id) => _context.CongTys.Any(e => e.MaCongTy == id);

        // HÀM PHỤ TRỢ: Tạo Slug từ tên (Ví dụ: "Công ty ABC" -> "cong-ty-abc")
        private string GenerateSlug(string phrase)
        {
            string str = phrase.ToLower();
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            str = Regex.Replace(str, @"\s+", " ").Trim();
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
            str = Regex.Replace(str, @"\s", "-");
            return str;
        }
    }
}
