namespace DatPhongOnline.Dtos.Auth
{
    public class UpdateUserDto
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Role { get; set; }
        public string? ResetCode { get; set; }
    }
}
