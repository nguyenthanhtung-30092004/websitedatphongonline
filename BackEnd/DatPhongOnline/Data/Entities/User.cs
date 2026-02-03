namespace DatPhongOnline.Data.Entities
{
    public class User
    {
        public int Id {  get; set; }
        public string? FullName  { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? Phone {  get; set; }
        public string? Role { get; set; }
        public Boolean IsLocked { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? ResetCode { get; set; }
        public DateTime? ResetCodeExpired { get; set; }
        public ICollection<Booking>? Bookings { get; set; }

    }
}
