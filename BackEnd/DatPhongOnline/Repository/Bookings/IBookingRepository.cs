using DatPhongOnline.Data.Entities;

namespace DatPhongOnline.Repository.Bookings
{
    public interface IBookingRepository
    {
        Task<bool> IsRoomAvailableAsync(int roomId, DateTime checkIn, DateTime checkOut);
        Task AddBookingAsync(Booking booking);
        Task AddBookingDetailAsync(BookingDetail bookingDetail);
        Task<List<Booking>> GetAllBookingListAsync();
        Task<List<Booking>> GetUserBookingsAsync(int userId);
        Task<Booking?> GetBookingByIdAsync(int id);
        Task<List<Room>> SearchAvailableRoomsAsync(DateTime checkIn,DateTime checkOut,int numberOfGuests,int? roomTypeId = null);
        Task SaveChangeAsync();
        Task<List<Room>> SearchAsync(DateTime CheckIn, DateTime CheckOut, int Adults, int Children);
    }
}
