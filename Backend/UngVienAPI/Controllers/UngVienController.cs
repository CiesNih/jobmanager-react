
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UngVienAPI.DTO;
using UngVienAPI.Models;


namespace UngVienAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class UngVienController : ControllerBase
    {
        private readonly BTLapicontext _context;

        public UngVienController(BTLapicontext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.UngViens
                .Include(u => u.HoSos)
                .Include(u => u.DonUngTuyens)
                .Select(u => new UngVienDTO
                {
                    MaUngVien = u.MaUngVien,
                    MaNguoiDung = u.MaNguoiDung,
                    TieuDeHoSo = u.TieuDeHoSo,
                    GioiThieu = u.GioiThieu,
                    DiaChi = u.DiaChi,
                    SoNamKinhNghiem = u.SoNamKinhNghiem,
                    HoSos = u.HoSos.Select(h => new HoSoDTO
                    {
                        MaHoSo = h.MaHoSo,
                        TenFile = h.TenFile,
                        DuongDanLuuTru = h.DuongDanLuuTru,
                        LoaiFile = h.LoaiFile
                    }).ToList(),
                    DonUngTuyens = u.DonUngTuyens.Select(d => new DonUngTuyenDTO
                    {
                        MaDon = d.MaDon,
                        MaViecLam = d.MaViecLam,
                        TrangThai = d.TrangThai,
                        ThuGioiThieu = d.ThuGioiThieu
                    }).ToList()
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var uv = await _context.UngViens
                .Include(u => u.HoSos)
                .Include(u => u.DonUngTuyens)
                .Where(u => u.MaUngVien == id)
                .Select(u => new UngVienDTO
                {
                    MaUngVien = u.MaUngVien,
                    MaNguoiDung = u.MaNguoiDung,
                    TieuDeHoSo = u.TieuDeHoSo,
                    GioiThieu = u.GioiThieu,
                    DiaChi = u.DiaChi,
                    SoNamKinhNghiem = u.SoNamKinhNghiem,
                    HoSos = u.HoSos.Select(h => new HoSoDTO
                    {
                        MaHoSo = h.MaHoSo,
                        TenFile = h.TenFile,
                        DuongDanLuuTru = h.DuongDanLuuTru,
                        LoaiFile = h.LoaiFile
                    }).ToList(),
                    DonUngTuyens = u.DonUngTuyens.Select(d => new DonUngTuyenDTO
                    {
                        MaDon = d.MaDon,
                        MaViecLam = d.MaViecLam,
                        TrangThai = d.TrangThai,
                        ThuGioiThieu = d.ThuGioiThieu
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (uv == null) return NotFound();
            return Ok(uv);
        }
        // POST: api/UngVien
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UngVienDTO dto)
        {
            var uv = new UngVien
            {
                MaNguoiDung = dto.MaNguoiDung,
                TieuDeHoSo = dto.TieuDeHoSo,
                GioiThieu = dto.GioiThieu,
                DiaChi = dto.DiaChi,
                SoNamKinhNghiem = dto.SoNamKinhNghiem
            };

            _context.UngViens.Add(uv);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = uv.MaUngVien }, uv);
        }
        // PUT: api/UngVien/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UngVienDTO dto)
        {
            var uv = await _context.UngViens.FindAsync(id);
            if (uv == null) return NotFound();

            uv.TieuDeHoSo = dto.TieuDeHoSo;
            uv.GioiThieu = dto.GioiThieu;
            uv.DiaChi = dto.DiaChi;
            uv.SoNamKinhNghiem = dto.SoNamKinhNghiem;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        // DELETE: api/UngVien/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var uv = await _context.UngViens
                .Include(u => u.HoSos)
                .Include(u => u.DonUngTuyens)
                .FirstOrDefaultAsync(u => u.MaUngVien == id);

            if (uv == null) return NotFound();

            _context.HoSos.RemoveRange(uv.HoSos);
            _context.DonUngTuyens.RemoveRange(uv.DonUngTuyens);
            _context.UngViens.Remove(uv);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // GET: api/UngVien/{id}/HoSos
        [HttpGet("{id}/HoSos")]
        public async Task<IActionResult> GetHoSos(Guid id)
        {
            var hoSos = await _context.HoSos
                .Where(h => h.MaUngVien == id)
                .Select(h => new HoSoDTO
                {
                    MaHoSo = h.MaHoSo,
                    TenFile = h.TenFile,
                    DuongDanLuuTru = h.DuongDanLuuTru,
                    LoaiFile = h.LoaiFile
                }).ToListAsync();

            return Ok(hoSos);
        }
        // GET: api/UngVien/{id}/DonUngTuyens
        [HttpGet("{id}/DonUngTuyens")]
        public async Task<IActionResult> GetDonUngTuyens(Guid id)
        {
            var donTuyens = await _context.DonUngTuyens
                .Where(d => d.MaUngVien == id)
                .Select(d => new DonUngTuyenDTO
                {
                    MaDon = d.MaDon,
                    MaViecLam = d.MaViecLam,
                    TrangThai = d.TrangThai,
                    ThuGioiThieu = d.ThuGioiThieu
                }).ToListAsync();

            return Ok(donTuyens);
        }

    }
}
