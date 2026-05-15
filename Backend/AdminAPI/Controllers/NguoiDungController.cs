using AdminAPI.DTOs;
using AdminAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;


namespace AdminAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin")] // ❌ TẠM THỜI BỎ ĐỂ TEST - SAU NÀY BẬT LẠI
    public class NguoiDungController : ControllerBase
    {
        private readonly BTLapicontext _context;

        public NguoiDungController(BTLapicontext context)
        {
            _context = context;
        }

        // GET: api/NguoiDung
        // Lấy danh sách tất cả người dùng
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NguoiDungDto>>> GetNguoiDungs()
        {
            var users = await _context.NguoiDungs
                .Select(u => new NguoiDungDto
                {
                    MaNguoiDung = u.MaNguoiDung,
                    Email = u.Email,
                    HoTen = u.HoTen,
                    SoDienThoai = u.SoDienThoai,
                    Avatar = u.Avatar,
                    MaQuyen = u.MaQuyen ?? 0,
                    TrangThai = u.TrangThai ?? false,
                    NgayTao = u.NgayTao,
                    NgayCapNhat = u.NgayCapNhat
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/NguoiDung/{id}
        // Lấy chi tiết 1 người dùng dựa vào MaNguoiDung
        [HttpGet("{id}")]
        public async Task<ActionResult<NguoiDungDto>> GetNguoiDung(Guid id)
        {
            var user = await _context.NguoiDungs.FindAsync(id);

            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng.");
            }

            return Ok(new NguoiDungDto
            {
                MaNguoiDung = user.MaNguoiDung,
                Email = user.Email,
                HoTen = user.HoTen,
                SoDienThoai = user.SoDienThoai,
                Avatar = user.Avatar,
                MaQuyen = user.MaQuyen ?? 0,
                TrangThai = user.TrangThai ?? false,
                NgayTao = user.NgayTao,
                NgayCapNhat = user.NgayCapNhat
            });
        }

        // POST: api/NguoiDung
        // Admin tạo thêm người dùng mới
        [HttpPost]
        public async Task<ActionResult<NguoiDungDto>> PostNguoiDung([FromBody] CreateNguoiDungDto dto)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(dto.Email) || !IsValidEmail(dto.Email))
            {
                return BadRequest(new { success = false, message = "Email không hợp lệ." });
            }

            if (string.IsNullOrWhiteSpace(dto.HoTen))
            {
                return BadRequest(new { success = false, message = "Họ tên không được để trống." });
            }

            // Kiểm tra email trùng
            if (await _context.NguoiDungs.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { success = false, message = "Email này đã được sử dụng." });
            }

            var newUser = new NguoiDung
            {
                MaNguoiDung = Guid.NewGuid(),
                Email = dto.Email,
                HoTen = dto.HoTen,
                SoDienThoai = dto.SoDienThoai,
                MaQuyen = dto.MaQuyen,
                TrangThai = dto.TrangThai,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now,
                // Mật khẩu mặc định là "123456" - User nên đổi sau lần đăng nhập đầu
                MatKhauHash = BCrypt.Net.BCrypt.HashPassword("123456")
            };

            _context.NguoiDungs.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNguoiDung), new { id = newUser.MaNguoiDung }, new 
            { 
                success = true, 
                message = "Tạo người dùng thành công. Mật khẩu mặc định: 123456",
                data = newUser 
            });
        }

        // PUT: api/NguoiDung/{id}
        // Cập nhật thông tin người dùng
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNguoiDung(Guid id, [FromBody] UpdateNguoiDungDto dto)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng.");
            }

            // Chỉ cập nhật các thông tin cho phép
            user.HoTen = dto.HoTen;
            user.SoDienThoai = dto.SoDienThoai;
            user.MaQuyen = dto.MaQuyen;
            user.TrangThai = dto.TrangThai;
            user.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok("Cập nhật thành công.");
        }

        // DELETE: api/NguoiDung/{id}
        // Xóa mềm: Chuyển trạng thái người dùng về 0 (Khóa tài khoản)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNguoiDung(Guid id) // ✅ Sửa từ string thành Guid
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy người dùng." });
            }

            // Đổi trạng thái thay vì xóa cứng (xóa hoàn toàn dữ liệu) để bảo toàn tính nguyên vẹn của DB
            user.TrangThai = false; // Giả sử false là trạng thái bị khóa / vô hiệu hóa
            user.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Khóa tài khoản thành công." });
        }
        [HttpPatch("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(Guid id, [FromBody] ResetPasswordDto dto)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy người dùng để reset mật khẩu!" });
            }

            if (string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest(new { success = false, message = "Mật khẩu mới không được để trống." });
            }

            if (dto.NewPassword.Length < 6)
            {
                return BadRequest(new { success = false, message = "Mật khẩu phải có ít nhất 6 ký tự." });
            }

            // ✅ Sử dụng BCrypt để băm mật khẩu
            user.MatKhauHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = $"Đã reset mật khẩu cho người dùng {user.HoTen} thành công!" });
        }

        // Helper method: Validate email format
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
