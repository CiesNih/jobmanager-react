using Microsoft.EntityFrameworkCore;
using UngVienAPI.Models;

namespace UngVienAPI.Models
{
    public class BTLapicontext : DbContext
    {
        public BTLapicontext(DbContextOptions<BTLapicontext> options)
            : base(options)
        {
        }

        public DbSet<NguoiDung> NguoiDungs { get; set; }
        public DbSet<UngVien> UngViens { get; set; }
        public DbSet<HoSo> HoSos { get; set; }
        public DbSet<DonUngTuyen> DonUngTuyens { get; set; }
        public DbSet<Quyen> Quyens { get; set; }
        public DbSet<ThongBao> ThongBaos { get; set; }
        public DbSet<PhongVan> PhongVans { get; set; }
        public DbSet<ThuMoiLamViec> ThuMoiLamViecs { get; set; }
        public DbSet<ViecLam> ViecLams { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map tên bảng chính xác
            modelBuilder.Entity<NguoiDung>().ToTable("NguoiDung");
            modelBuilder.Entity<UngVien>().ToTable("UngVien");
            modelBuilder.Entity<HoSo>().ToTable("HoSo");
            modelBuilder.Entity<DonUngTuyen>().ToTable("DonUngTuyen");
            modelBuilder.Entity<Quyen>().ToTable("Quyen");
            modelBuilder.Entity<ThongBao>().ToTable("ThongBao");
            modelBuilder.Entity<ViecLam>().ToTable("ViecLam");
            modelBuilder.Entity<PhongVan>().ToTable("PhongVan");
            modelBuilder.Entity<ThuMoiLamViec>().ToTable("ThuMoiLamViec");

            // Quan hệ NguoiDung - Quyen
            modelBuilder.Entity<NguoiDung>()
                .HasOne(nd => nd.Quyen)
                .WithMany(q => q.NguoiDungs)
                .HasForeignKey(nd => nd.MaQuyen)
                .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ UngVien - NguoiDung
            modelBuilder.Entity<UngVien>()
                .HasOne(uv => uv.NguoiDung)
                .WithMany(nd => nd.UngViens)
                .HasForeignKey(uv => uv.MaNguoiDung)
                .OnDelete(DeleteBehavior.Cascade);

            // Quan hệ HoSo - UngVien
            modelBuilder.Entity<HoSo>()
                .HasOne(hs => hs.UngVien)
                .WithMany(uv => uv.HoSos)
                .HasForeignKey(hs => hs.MaUngVien)
                .OnDelete(DeleteBehavior.Cascade);

            // Quan hệ DonUngTuyen - UngVien / HoSo
            modelBuilder.Entity<DonUngTuyen>()
                .HasOne(d => d.UngVien)
                .WithMany(uv => uv.DonUngTuyens)
                .HasForeignKey(d => d.MaUngVien)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DonUngTuyen>()
                .HasOne(d => d.HoSo)
                .WithMany(hs => hs.DonUngTuyens)
                .HasForeignKey(d => d.MaHoSo)
                .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ ThongBao - NguoiDung
            modelBuilder.Entity<ThongBao>()
                .HasOne(tb => tb.NguoiDung)
                .WithMany(nd => nd.ThongBaos)
                .HasForeignKey(tb => tb.MaNguoiNhan)
                .OnDelete(DeleteBehavior.Cascade);
            //Quan hệ viec lam - congty
            modelBuilder.Entity<ViecLam>()
                .HasOne(v => v.MaCongTyNavigation) 
                .WithMany(c => c.ViecLams)         
                .HasForeignKey(v => v.MaCongTy)    
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<DonUngTuyen>()
                .HasOne(d => d.MaViecLamNavigation)
                .WithMany(v => v.DonUngTuyens) 
                .HasForeignKey(d => d.MaViecLam)
                .HasConstraintName("FK_DonUngTuyen_ViecLam");
            modelBuilder.Entity<PhongVan>(entity =>
            {
                entity.ToTable("PhongVan");
                entity.HasOne(p => p.MaDonNavigation)
                      .WithMany(d => d.PhongVans) 
                      .HasForeignKey(p => p.MaDon)
                      .HasConstraintName("FK_PhongVan_DonUngTuyen");

                
            });
        }
    }
}