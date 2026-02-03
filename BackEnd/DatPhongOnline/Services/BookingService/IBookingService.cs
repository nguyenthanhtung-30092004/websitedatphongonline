using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Booking;
using DatPhongOnline.Dtos.Room;

namespace DatPhongOnline.Services.BookingService
{
    public interface IBookingService
    {
        Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto dto);
        Task CancelBooking(int bookingId, int userId);
        Task AdminUpdateStatusAsync(int bookingId, BookingStatus status);
        Task<List<BookingDto>> GetAllBookAsync();
        Task<BookingDto> GetBookingByIdAsync(int bookingId);
        Task<List<BookingDto>> GetUserBookingsAsync(int userId);

        Task<List<RoomDto>> SearchRoomsAsync(SearchRoomDto dto);
    }

}
