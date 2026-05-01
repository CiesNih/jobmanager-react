using Microsoft.EntityFrameworkCore;

namespace AdminAPI.Models
{
    public class BTLapicontext: DbContext
    {
        public BTLapicontext(DbContextOptions<BTLapicontext> options)
            : base(options)
        {
        }

        public virtual DbSet<NguoiDung> NguoiDungs { get; set; }
        public virtual DbSet<Quyen> Quyens { get; set; }
        public virtual DbSet<CongTy> CongTys { get; set; }
        public virtual DbSet<ViecLam> ViecLams { get; set; }
        public virtual DbSet<UngVien> UngViens { get; set; }
        public virtual DbSet<HoSo> HoSos { get; set; }
        public virtual DbSet<DonUngTuyen> DonUngTuyens { get; set; }
        public virtual DbSet<KyNang> KyNangs { get; set; }
        public virtual DbSet<ViecLamKyNang> ViecLamKyNangs { get; set; }
        public virtual DbSet<PhongVan> PhongVans { get; set; }
        public virtual DbSet<ThongBao> ThongBaos { get; set; }
        public virtual DbSet<LichSuUngThang> LichSuUngThangs { get; set; }
        public virtual DbSet<ThuMoiLamViec> ThuMoiLamViecs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NguoiDung>(entity =>
            {
                entity.ToTable("NguoiDung");
                entity.HasKey(e => e.MaNguoiDung);

                // Cấu hình mối quan hệ 1-nhiều
                entity.HasOne(d => d.MaQuyenNavigation)
                    .WithMany(p => p.NguoiDungs)
                    .HasForeignKey(d => d.MaQuyen);
            });

            modelBuilder.Entity<Quyen>(entity =>
            {
                entity.ToTable("Quyen");
                entity.HasKey(e => e.MaQuyen);
            });
            modelBuilder.Entity<CongTy>(entity =>
            {
                entity.ToTable("CongTy");
                entity.HasKey(e => e.MaCongTy);
            });

            modelBuilder.Entity<ViecLam>(entity =>
            {
                entity.ToTable("ViecLam");
                entity.HasKey(e => e.MaViecLam);
            });

            modelBuilder.Entity<UngVien>(entity =>
            {
                entity.ToTable("UngVien");
                entity.HasKey(e => e.MaUngVien);

                entity.HasOne(d => d.NguoiDung)
                    .WithMany()
                    .HasForeignKey(d => d.MaNguoiDung)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<HoSo>(entity =>
            {
                entity.ToTable("HoSo");
                entity.HasKey(e => e.MaHoSo);

                entity.HasOne(d => d.UngVien)
                    .WithMany(p => p.HoSos)
                    .HasForeignKey(d => d.MaUngVien)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DonUngTuyen>(entity =>
            {
                entity.ToTable("DonUngTuyen");
                entity.HasKey(e => e.MaDon);

                // Bỏ relationship với ViecLam vì DonUngTuyens đã bị NotMapped
                // entity.HasOne(d => d.ViecLam)
                //     .WithMany(p => p.DonUngTuyens)
                //     .HasForeignKey(d => d.MaViecLam)
                //     .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.UngVien)
                    .WithMany(p => p.DonUngTuyens)
                    .HasForeignKey(d => d.MaUngVien)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.HoSo)
                    .WithMany()
                    .HasForeignKey(d => d.MaHoSo)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<KyNang>(entity =>
            {
                entity.ToTable("KyNang");
                entity.HasKey(e => e.MaKyNang);
            });

            modelBuilder.Entity<ViecLamKyNang>(entity =>
            {
                entity.ToTable("ViecLam_KyNang");
                entity.HasKey(e => new { e.MaViecLam, e.MaKyNang });

                // Bỏ relationship với ViecLam vì ViecLamKyNangs đã bị NotMapped
                // entity.HasOne(d => d.ViecLam)
                //     .WithMany()
                //     .HasForeignKey(d => d.MaViecLam)
                //     .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.KyNang)
                    .WithMany()
                    .HasForeignKey(d => d.MaKyNang)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<PhongVan>(entity =>
            {
                entity.ToTable("PhongVan");
                entity.HasKey(e => e.MaPhongVan);

                entity.HasOne(d => d.DonUngTuyen)
                    .WithMany()
                    .HasForeignKey(d => d.MaDon)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ThongBao>(entity =>
            {
                entity.ToTable("ThongBao");
                entity.HasKey(e => e.MaThongBao);

                entity.HasOne(d => d.NguoiNhan)
                    .WithMany()
                    .HasForeignKey(d => d.MaNguoiNhan)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<LichSuUngThang>(entity =>
            {
                entity.ToTable("LichSuUngThang");
                entity.HasKey(e => e.MaLichSu);

                entity.HasOne(d => d.NguoiDung)
                    .WithMany()
                    .HasForeignKey(d => d.MaNguoiDung)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ThuMoiLamViec>(entity =>
            {
                entity.ToTable("ThuMoiLamViec");
                entity.HasKey(e => e.MaThu);

                entity.HasOne(d => d.DonUngTuyen)
                    .WithMany()
                    .HasForeignKey(d => d.MaDon)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
        
    }
}
