using DatPhongOnline.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatPhongOnline.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<MenuNav> MenuNavs { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; } = null!;
        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<RoomImage> RoomImages { get; set; } = null!;
        public DbSet<Amenity> Amenities { get; set; } = null!;
        public DbSet<RoomAmenity> RoomAmenities { get; set; } = null!;

        // Booking
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingDetail> BookingDetails { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
            });
            modelBuilder.Entity<RoomType>(entity =>
            {
                entity.ToTable("RoomTypes");
                entity.Property(e => e.Name)
                      .IsRequired()
                      .HasMaxLength(100);
            });
            modelBuilder.Entity<RoomAmenity>()
                .HasKey(x => new {x.RoomId, x.AmenityId });
            modelBuilder.Entity<RoomAmenity>()
                .HasOne(x => x.Room)
                .WithMany(x => x.RoomAmenities)
                .HasForeignKey(x => x.RoomId);
            modelBuilder.Entity<RoomAmenity>()
                .HasOne(x => x.Amenity)
                .WithMany(x => x.RoomAmenities)
                .HasForeignKey(x => x.AmenityId);
            modelBuilder.Entity<Room>()
                .HasMany(r => r.RoomImages)
                .WithOne(x => x.Room)
                .HasForeignKey(ri => ri.RoomId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Booking>()
                .HasMany(b => b.BookingDetails)
                .WithOne(d => d.Booking)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Booking>()
                .Property(b => b.Status)
                .HasMaxLength(20)
                .HasDefaultValue(BookingStatus.Pending);
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId);
        }
    }
}
