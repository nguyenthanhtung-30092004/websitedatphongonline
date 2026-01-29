using DatPhongOnline.Data;
using DatPhongOnline.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatPhongOnline.Repository.Bookings
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Booking>> GetAllBookingListAsync()
        {
            return await _context.Bookings
                .Include(b => b.BookingDetails)
                .ThenInclude(bd => bd.Room)
                .ToListAsync();
        }

        public async Task<List<Booking>> GetUserBookingsAsync(int userId)
        {
            return await _context.Bookings
                .Where(b => b.UserId == userId)
                .Include(b => b.BookingDetails)
                .ThenInclude(bd => bd.Room)
                .ToListAsync();
        }

        public async Task<bool> IsRoomAvailableAsync(int roomId, DateTime checkIn, DateTime checkOut)
        {
            return !await _context.BookingDetails
                .AnyAsync(bd => bd.RoomId == roomId
                && bd.Booking.Status != BookingStatus.Canceled
                && checkIn < bd.Booking.CheckOutDate
                && checkOut > bd.Booking.CheckInDate);
        }

        public async Task AddBookingAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
        }

        public async Task AddBookingDetailAsync(BookingDetail bookingDetail)
        {
            await _context.BookingDetails.AddAsync(bookingDetail);
        }

        public async Task<Booking?> GetBookingByIdAsync(int id)
        {
            return await _context.Bookings
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task SaveChangeAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
