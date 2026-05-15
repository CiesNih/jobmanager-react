using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UngVienAPI.Models;


namespace UngVienAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoSoController : ControllerBase
    {
        private readonly BTLapicontext _context;
        private readonly IWebHostEnvironment _environment;

        public HoSoController(BTLapicontext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }
        [HttpPost("UploadCV")]
        public async Task<IActionResult> UploadCV(IFormFile file, [FromForm] Guid maUngVien)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Vui lòng chọn file CV.");

            // 1. Kiểm tra định dạng file (chỉ cho phép pdf, docx)
            var allowedExtensions = new[] { ".pdf", ".docx", ".doc" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                return BadRequest("Định dạng file không được hỗ trợ (Chỉ nhận .pdf, .docx).");

            // 2. Tạo tên file duy nhất để tránh trùng lặp
            var fileName = $"{Guid.NewGuid()}{extension}";
            var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads");
            var filePath = Path.Combine(uploadsPath, fileName);

            // 3. Lưu file vào thư mục wwwroot/uploads
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 4. Lưu thông tin vào Database (Bảng HoSo)
            var hoSo = new HoSo
            {
                MaHoSo = Guid.NewGuid(),
                MaUngVien = maUngVien,
                TenFile = file.FileName,
                DuongDanLuuTru = "/uploads/" + fileName,
                LoaiFile = extension.Replace(".", ""),
                KichThuoc = (int)file.Length,
                NgayTaiLen = DateTime.Now,
                MacDinh = true
            };

            _context.HoSos.Add(hoSo);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tải lên CV thành công", maHoSo = hoSo.MaHoSo });
        }

        [HttpGet("DanhSachHoSo/{maUngVien}")]
        public async Task<IActionResult> GetDanhSachHoSo(Guid maUngVien)
        {
            var list = await _context.HoSos
                .Where(h => h.MaUngVien == maUngVien)
                .OrderByDescending(h => h.NgayTaiLen)
                .ToListAsync();
            return Ok(list);
        }
    }
}
