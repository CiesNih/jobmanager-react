using AdminAPI.Models;
using AdminAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace AdminAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController: ControllerBase
    {
        private readonly BTLapicontext _context; // Tên DbContext trong hình của bạn
        private readonly IConfiguration _configuration;

        public AuthController(BTLapicontext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { success = false, message = "Email và mật khẩu không được để trống!" });
            }

            // Tìm người dùng và kết nối với bảng Quyen dựa trên MaQuyen
            var user = await _context.NguoiDungs
                .Include(u => u.MaQuyenNavigation)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không đúng!" });
            }

            // ✅ Verify password - hỗ trợ cả BCrypt và plaintext (tạm thời)
            bool isPasswordValid = false;
            
            // Kiểm tra nếu là BCrypt hash (bắt đầu bằng $2a, $2b, $2y)
            if (user.MatKhauHash.StartsWith("$2"))
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.MatKhauHash);
            }
            else
            {
                // Fallback: so sánh plaintext (CHỈ ĐỂ TEST - KHÔNG AN TOÀN)
                isPasswordValid = (request.Password == user.MatKhauHash || 
                                  request.Password + "hash" == user.MatKhauHash);
            }
            
            if (!isPasswordValid)
            {
                return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không đúng!" });
            }

            if (user.TrangThai == false)
            {
                return BadRequest(new { success = false, message = "Tài khoản hiện đang bị khóa." });
            }

            // Tạo Token JWT
            var token = GenerateJwtToken(user);

            return Ok(new LoginResponse
            {
                Token = token,
                Email = user.Email,
                HoTen = user.HoTen,
                Role = user.MaQuyenNavigation?.TenQuyen
            });
        }

        // ✅ Helper endpoint để hash password (CHỈ ĐỂ DEV)
        [HttpPost("hash-password")]
        public IActionResult HashPassword([FromBody] string password)
        {
            var hash = BCrypt.Net.BCrypt.HashPassword(password);
            return Ok(new { password, hash });
        }

        private string GenerateJwtToken(NguoiDung user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.MaQuyenNavigation?.TenQuyen ?? "UngVien"),
                new Claim("UserId", user.MaNguoiDung.ToString())
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
