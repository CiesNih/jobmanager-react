using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace NhaTuyenDungAPI.Models;

public partial class BtlwebapiContext : DbContext
{
    public BtlwebapiContext()
    {
    }

    public BtlwebapiContext(DbContextOptions<BtlwebapiContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CongTy> CongTies { get; set; }

    public virtual DbSet<DonUngTuyen> DonUngTuyens { get; set; }

    public virtual DbSet<HoSo> HoSos { get; set; }

    public virtual DbSet<KyNang> KyNangs { get; set; }

    public virtual DbSet<LichSuHeThong> LichSuHeThongs { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<PhongVan> PhongVans { get; set; }

    public virtual DbSet<Quyen> Quyens { get; set; }

    public virtual DbSet<ThongBao> ThongBaos { get; set; }

    public virtual DbSet<ThuMoiLamViec> ThuMoiLamViecs { get; set; }

    public virtual DbSet<UngVien> UngViens { get; set; }

    public virtual DbSet<ViecLam> ViecLams { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-D4ADKL6\\MAY1;Database=BTLWEBAPI;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CongTy>(entity =>
        {
            entity.HasKey(e => e.MaCongTy).HasName("PK__CongTy__E452D3DB0C8D9BCD");

            entity.ToTable("CongTy");

            entity.HasIndex(e => e.Slug, "UQ__CongTy__BC7B5FB6C0DB34BC").IsUnique();

            entity.Property(e => e.MaCongTy).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Logo).HasMaxLength(500);
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Slug).HasMaxLength(255);
            entity.Property(e => e.TenCongTy).HasMaxLength(255);
            entity.Property(e => e.Website).HasMaxLength(255);

            entity.HasOne(d => d.TaoBoiNavigation).WithMany(p => p.CongTies)
                .HasForeignKey(d => d.TaoBoi)
                .HasConstraintName("FK__CongTy__TaoBoi__5812160E");
        });

        modelBuilder.Entity<DonUngTuyen>(entity =>
        {
            entity.HasKey(e => e.MaDon).HasName("PK__DonUngTu__3D89F56832409BD5");

            entity.ToTable("DonUngTuyen");

            entity.HasIndex(e => new { e.MaViecLam, e.MaUngVien }, "UQ_UngTuyen").IsUnique();

            entity.Property(e => e.MaDon).HasDefaultValueSql("(newid())");
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayNop)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("applied");

            entity.HasOne(d => d.MaHoSoNavigation).WithMany(p => p.DonUngTuyens)
                .HasForeignKey(d => d.MaHoSo)
                .HasConstraintName("FK__DonUngTuy__MaHoS__00200768");

            entity.HasOne(d => d.MaUngVienNavigation).WithMany(p => p.DonUngTuyens)
                .HasForeignKey(d => d.MaUngVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonUngTuy__MaUng__7F2BE32F");

            entity.HasOne(d => d.MaViecLamNavigation).WithMany(p => p.DonUngTuyens)
                .HasForeignKey(d => d.MaViecLam)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonUngTuy__MaVie__7E37BEF6");
        });

        modelBuilder.Entity<HoSo>(entity =>
        {
            entity.HasKey(e => e.MaHoSo).HasName("PK__HoSo__1666423C7AD19B91");

            entity.ToTable("HoSo");

            entity.Property(e => e.MaHoSo).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DuongDanLuuTru).HasMaxLength(500);
            entity.Property(e => e.LoaiFile).HasMaxLength(50);
            entity.Property(e => e.MaHash).HasMaxLength(200);
            entity.Property(e => e.MacDinh).HasDefaultValue(true);
            entity.Property(e => e.NgayTaiLen)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TenFile).HasMaxLength(255);

            entity.HasOne(d => d.MaUngVienNavigation).WithMany(p => p.HoSos)
                .HasForeignKey(d => d.MaUngVien)
                .HasConstraintName("FK__HoSo__MaUngVien__76969D2E");
        });

        modelBuilder.Entity<KyNang>(entity =>
        {
            entity.HasKey(e => e.MaKyNang).HasName("PK__KyNang__796CFDAF69327CDC");

            entity.ToTable("KyNang");

            entity.HasIndex(e => e.TenKyNang, "UQ__KyNang__89D6F06DA9983D85").IsUnique();

            entity.Property(e => e.TenKyNang).HasMaxLength(100);
        });

        modelBuilder.Entity<LichSuHeThong>(entity =>
        {
            entity.HasKey(e => e.MaLog).HasName("PK__LichSuHe__3B98D24AEAB417BE");

            entity.ToTable("LichSuHeThong");

            entity.Property(e => e.HanhDong).HasMaxLength(100);
            entity.Property(e => e.LoaiThucThe).HasMaxLength(100);
            entity.Property(e => e.MaThucThe).HasMaxLength(200);
            entity.Property(e => e.ThoiGian)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.MaNguoiTacDongNavigation).WithMany(p => p.LichSuHeThongs)
                .HasForeignKey(d => d.MaNguoiTacDong)
                .HasConstraintName("FK__LichSuHeT__MaNgu__19DFD96B");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung).HasName("PK__NguoiDun__C539D76206E39BBE");

            entity.ToTable("NguoiDung");

            entity.HasIndex(e => e.Email, "UQ__NguoiDun__A9D10534213FB2F6").IsUnique();

            entity.Property(e => e.MaNguoiDung).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Avatar).HasMaxLength(500);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.HoTen).HasMaxLength(255);
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SoDienThoai).HasMaxLength(30);
            entity.Property(e => e.TrangThai).HasDefaultValue(true);

            entity.HasOne(d => d.MaQuyenNavigation).WithMany(p => p.NguoiDungs)
                .HasForeignKey(d => d.MaQuyen)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NguoiDung__MaQuy__5165187F");
        });

        modelBuilder.Entity<PhongVan>(entity =>
        {
            entity.HasKey(e => e.MaPhongVan).HasName("PK__PhongVan__C7954C3951905164");

            entity.ToTable("PhongVan");

            entity.Property(e => e.MaPhongVan).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DiaDiem).HasMaxLength(255);
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ThoiGian).HasColumnType("datetime");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("scheduled");

            entity.HasOne(d => d.MaDonNavigation).WithMany(p => p.PhongVans)
                .HasForeignKey(d => d.MaDon)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhongVan__MaDon__06CD04F7");

            entity.HasOne(d => d.MaNguoiPhongVanNavigation).WithMany(p => p.PhongVans)
                .HasForeignKey(d => d.MaNguoiPhongVan)
                .HasConstraintName("FK__PhongVan__MaNguo__07C12930");
        });

        modelBuilder.Entity<Quyen>(entity =>
        {
            entity.HasKey(e => e.MaQuyen).HasName("PK__Quyen__1D4B7ED463DDD75C");

            entity.ToTable("Quyen");

            entity.HasIndex(e => e.TenQuyen, "UQ__Quyen__5637EE7920B74DC2").IsUnique();

            entity.Property(e => e.TenQuyen).HasMaxLength(50);
        });

        modelBuilder.Entity<ThongBao>(entity =>
        {
            entity.HasKey(e => e.MaThongBao).HasName("PK__ThongBao__04DEB54E7E2C2119");

            entity.ToTable("ThongBao");

            entity.Property(e => e.MaThongBao).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DaXem).HasDefaultValue(false);
            entity.Property(e => e.DuongDan).HasMaxLength(500);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TieuDe).HasMaxLength(255);

            entity.HasOne(d => d.MaNguoiNhanNavigation).WithMany(p => p.ThongBaos)
                .HasForeignKey(d => d.MaNguoiNhan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ThongBao__MaNguo__160F4887");
        });

        modelBuilder.Entity<ThuMoiLamViec>(entity =>
        {
            entity.HasKey(e => e.MaOffer).HasName("PK__ThuMoiLa__F10C0C4715267F88");

            entity.ToTable("ThuMoiLamViec");

            entity.HasIndex(e => e.MaDon, "UQ__ThuMoiLa__3D89F5699383C302").IsUnique();

            entity.Property(e => e.MaOffer).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DonViTienTe)
                .HasMaxLength(10)
                .HasDefaultValue("VND");
            entity.Property(e => e.NgayGui)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayPhanHoi).HasColumnType("datetime");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("pending");

            entity.HasOne(d => d.MaDonNavigation).WithOne(p => p.ThuMoiLamViec)
                .HasForeignKey<ThuMoiLamViec>(d => d.MaDon)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ThuMoiLam__MaDon__0F624AF8");

            entity.HasOne(d => d.MaNguoiGuiNavigation).WithMany(p => p.ThuMoiLamViecs)
                .HasForeignKey(d => d.MaNguoiGui)
                .HasConstraintName("FK__ThuMoiLam__MaNgu__10566F31");
        });

        modelBuilder.Entity<UngVien>(entity =>
        {
            entity.HasKey(e => e.MaUngVien).HasName("PK__UngVien__8FDBA8A9CD7D7248");

            entity.ToTable("UngVien");

            entity.HasIndex(e => e.MaNguoiDung, "UQ__UngVien__C539D7635CD9794D").IsUnique();

            entity.Property(e => e.MaUngVien).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TieuDeHoSo).HasMaxLength(255);

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.UngVien)
                .HasForeignKey<UngVien>(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UngVien__MaNguoi__70DDC3D8");
        });

        modelBuilder.Entity<ViecLam>(entity =>
        {
            entity.HasKey(e => e.MaViecLam).HasName("PK__ViecLam__8648CD602AC05952");

            entity.ToTable("ViecLam");

            entity.HasIndex(e => e.Slug, "UQ__ViecLam__BC7B5FB6ED09C4D0").IsUnique();

            entity.Property(e => e.MaViecLam).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DaDuyet).HasDefaultValue(false);
            entity.Property(e => e.DiaDiem).HasMaxLength(255);
            entity.Property(e => e.DuocHienThi).HasDefaultValue(false);
            entity.Property(e => e.LoaiHinhCongViec).HasMaxLength(50);
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayDang)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayHetHan).HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Slug).HasMaxLength(255);
            entity.Property(e => e.SoLuotXem).HasDefaultValue(0);
            entity.Property(e => e.TieuDe).HasMaxLength(255);

            entity.HasOne(d => d.MaCongTyNavigation).WithMany(p => p.ViecLams)
                .HasForeignKey(d => d.MaCongTy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ViecLam__MaCongT__628FA481");

            entity.HasOne(d => d.TaoBoiNavigation).WithMany(p => p.ViecLams)
                .HasForeignKey(d => d.TaoBoi)
                .HasConstraintName("FK__ViecLam__TaoBoi__6383C8BA");

            entity.HasMany(d => d.MaKyNangs).WithMany(p => p.MaViecLams)
                .UsingEntity<Dictionary<string, object>>(
                    "ViecLamKyNang",
                    r => r.HasOne<KyNang>().WithMany()
                        .HasForeignKey("MaKyNang")
                        .HasConstraintName("FK__ViecLam_K__MaKyN__6A30C649"),
                    l => l.HasOne<ViecLam>().WithMany()
                        .HasForeignKey("MaViecLam")
                        .HasConstraintName("FK__ViecLam_K__MaVie__693CA210"),
                    j =>
                    {
                        j.HasKey("MaViecLam", "MaKyNang").HasName("PK__ViecLam___61DE02BAF89AFE94");
                        j.ToTable("ViecLam_KyNang");
                    });
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
