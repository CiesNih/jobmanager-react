using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UngVienAPI.Models;
using UngVienAPI.DTO;

namespace UngVienAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UngVienHelperController : ControllerBase
    {
        private readonly BTLapicontext _context;

        public UngVienHelperController(BTLapicontext context)
        {
            _context = context;
        }
        //get xem lịch sử ưng tuyển 
        [HttpGet("LichSuUngTuyen/{maUngVien}")]
        public async Task<IActionResult> GetLichSu(Guid maUngVien)
        {
            var check = await _context.UngViens.AnyAsync(u => u.MaUngVien == maUngVien);
            if (!check) return NotFound("Không tìm thấy ứng viên.");
            var lichSu = await _context.DonUngTuyens
                .Include(d => d.MaViecLamNavigation)
                    .ThenInclude(v => v.MaCongTyNavigation)
                .Where(d => d.MaUngVien == maUngVien)
                .Select(d => new
                {
                    TenCongViec = d.MaViecLamNavigation.TieuDe,
                    TenCongTy = d.MaViecLamNavigation.MaCongTyNavigation.TenCongTy,
                    NgayNop = d.NgayNop,
                    TrangThai = d.TrangThai
                })
                .OrderByDescending(d => d.NgayNop)
                .ToListAsync();

            return Ok(lichSu);
        }
        //get xem lịch phỏng vấn
        [HttpGet("LichPhongVan/{maUngVien}")]
        public async Task<IActionResult> GetLichPhongVan(Guid maUngVien)
        {
            var lich = await _context.PhongVans
                .Include(p => p.MaDonNavigation)
                    .ThenInclude(d => d.MaViecLamNavigation)
                .Where(p => p.MaDonNavigation.MaUngVien == maUngVien)
                .Select(p => new {
                    CongViec = p.MaDonNavigation.MaViecLamNavigation.TieuDe,
                    ThoiGian = p.ThoiGian,
                    DiaDiem = p.DiaDiem,
                    GhiChu = p.GhiChu,
                    TrangThai = p.TrangThai
                })
                .ToListAsync();

            return Ok(lich);
        }
        //get tim kiêm viec lam
        [HttpGet("TimKiemViecLam")]
        public async Task<IActionResult> SearchJobs(string keyword)
        {
            var jobs = await _context.ViecLams
                .Where(v => v.DuocHienThi == true && (v.TieuDe.Contains(keyword) || v.DiaDiem.Contains(keyword)))
                .Select(v => new { v.MaViecLam, v.TieuDe, v.DiaDiem, v.LuongToiDa })
                .ToListAsync();

            return Ok(jobs);
        }
        // post nộp đơn
        [HttpPost("NopDon")]
        public async Task<IActionResult> NopDon([FromBody] DonUngTuyenCreateDTO dto)
        {
            var daNop = await _context.DonUngTuyens
                .AnyAsync(d => d.MaViecLam == dto.MaViecLam && d.MaUngVien == dto.MaUngVien);
            if (daNop)
                return BadRequest("Bạn đã nộp đơn cho công việc này rồi.");

            var don = new DonUngTuyen
            {
                MaViecLam = dto.MaViecLam,
                MaUngVien = dto.MaUngVien,
                MaHoSo = dto.MaHoSo,
                ThuGioiThieu = dto.ThuGioiThieu,
                TrangThai = "applied",
                NgayNop = DateTime.Now
            };
            _context.DonUngTuyens.Add(don);
            await _context.SaveChangesAsync();
            return Ok("Nộp đơn thành công");
        }
        //put phản hồi
        public DateTime? NgayPhanHoi { get; set; }
        [HttpPut("PhanHoiOffer/{maOffer}")]
        public async Task<IActionResult> PhanHoiOffer(Guid maOffer, [FromBody] string status)
        {
            var offer = await _context.ThuMoiLamViecs.FindAsync(maOffer);
            if (offer == null) return NotFound();

            offer.TrangThai = status; // 'Accepted' hoặc 'Declined'
            offer.NgayPhanHoi = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok("Đã gửi phản hồi");
        }
    }
}
