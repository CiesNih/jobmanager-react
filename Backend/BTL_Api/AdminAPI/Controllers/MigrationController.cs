using AdminAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdminAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MigrationController : ControllerBase
    {
        private readonly BTLapicontext _context;

        public MigrationController(BTLapicontext context)
        {
            _context = context;
        }

        /// <summary>
        /// ENDPOINT TẠM THỜI - CHỈ CHẠY 1 LẦN
        /// Migrate tất cả mật khẩu từ format cũ (plaintext + "hash") sang BCrypt
        /// SAU KHI CHẠY XONG, NÊN XÓA ENDPOINT NÀY ĐI
        /// </summary>
        [HttpPost("migrate-passwords")]
        public async Task<IActionResult> MigratePasswordsToBCrypt()
        {
            try
            {
                // Lấy tất cả users có mật khẩu format cũ (kết thúc bằng "hash")
                var users = await _context.NguoiDungs
                    .Where(u => u.MatKhauHash.EndsWith("hash"))
                    .ToListAsync();

                if (users.Count == 0)
                {
                    return Ok(new 
                    { 
                        success = true, 
                        message = "Không có mật khẩu nào cần migrate. Tất cả đã được hash bằng BCrypt." 
                    });
                }

                int migratedCount = 0;
                var migrationLog = new List<string>();

                foreach (var user in users)
                {
                    // Lấy password gốc (bỏ "hash" ở cuối)
                    string originalPassword = user.MatKhauHash.Replace("hash", "");
                    
                    // Hash lại bằng BCrypt
                    string bcryptHash = BCrypt.Net.BCrypt.HashPassword(originalPassword);
                    
                    // Update vào database
                    user.MatKhauHash = bcryptHash;
                    user.NgayCapNhat = DateTime.Now;
                    
                    migratedCount++;
                    migrationLog.Add($"✅ Migrated: {user.Email} (Password: {originalPassword})");
                }

                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    success = true, 
                    message = $"Đã migrate {migratedCount} mật khẩu sang BCrypt thành công!",
                    migratedCount = migratedCount,
                    details = migrationLog
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "Lỗi khi migrate mật khẩu!", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Kiểm tra trạng thái migration
        /// </summary>
        [HttpGet("check-migration-status")]
        public async Task<IActionResult> CheckMigrationStatus()
        {
            var totalUsers = await _context.NguoiDungs.CountAsync();
            var oldFormatUsers = await _context.NguoiDungs
                .Where(u => u.MatKhauHash.EndsWith("hash"))
                .CountAsync();
            var bcryptUsers = totalUsers - oldFormatUsers;

            return Ok(new 
            { 
                totalUsers = totalUsers,
                bcryptUsers = bcryptUsers,
                oldFormatUsers = oldFormatUsers,
                migrationComplete = oldFormatUsers == 0,
                message = oldFormatUsers == 0 
                    ? "✅ Tất cả mật khẩu đã được migrate sang BCrypt" 
                    : $"⚠️ Còn {oldFormatUsers} mật khẩu chưa migrate"
            });
        }
    }
}
