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

        public async Task<bool> IsRoomAvailableAsync(
            int roomId,
            DateTime checkIn,
            DateTime checkOut)
        {
            return !await _context.BookingDetails
                .AnyAsync(d =>
                    d.RoomId == roomId &&
                    d.Booking.Status != BookingStatus.Canceled &&
                    checkIn < d.Booking.CheckOutDate &&
                    checkOut > d.Booking.CheckInDate
                );
        }

        public async Task<List<Room>> SearchAvailableRoomsAsync(
                DateTime checkIn,
                DateTime checkOut,
                int numberOfGuests,
                int? roomTypeId = null)
        {
            var query = _context.Rooms
                .Include(r => r.RoomType)
                .Where(r =>
                    r.Status == "Available" &&
                    r.RoomType.MaxGuests >= numberOfGuests
                );

            if (roomTypeId.HasValue)
            {
                query = query.Where(r => r.RoomTypeId == roomTypeId.Value);
            }

            query = query.Where(r =>
                !_context.BookingDetails.Any(d =>
                    d.RoomId == r.Id &&
                    d.Booking.Status != BookingStatus.Canceled &&
                    checkIn < d.Booking.CheckOutDate &&
                    checkOut > d.Booking.CheckInDate
                )
            );

            return await query.ToListAsync();
        }

        public async Task AddBookingAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
        }

        public async Task AddBookingDetailAsync(BookingDetail bookingDetail)
        {
            await _context.BookingDetails.AddAsync(bookingDetail);
        }

        public async Task<Booking?> GetBookingByIdAsync(int bookingId)
        {
            return await _context.Bookings
                .Include(b => b.BookingDetails)
                    .ThenInclude(d => d.Room)
                .FirstOrDefaultAsync(b => b.Id == bookingId);
        }


        public async Task SaveChangeAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<List<Room>> SearchAsync(DateTime CheckIn, DateTime CheckOut, int Adults, int Children)
        {
            if(CheckOut <= CheckIn)
            {
                throw new Exception("Check-out phải sau checkin");
            }
            var query = _context.Rooms.Include(r => r.RoomType)
                .Include(r => r.RoomImages)
                .Include(r => r.RoomAmenities)
                .ThenInclude(ra => ra.Amenity)
                .Where(r => r.RoomType.MaxGuests >= Adults + Children).AsQueryable();
            query =  query.Where(r => !_context.BookingDetails
            .Any(d => d.RoomId == r.Id && d.Booking.Status != BookingStatus.Canceled 
            && CheckIn < d.Booking.CheckOutDate &&
            CheckOut > d.Booking.CheckInDate));

            return await query.ToListAsync();
        }

        public async Task<List<Room>> GetTopBookedRoomsAsync(int top)
        {
            return await _context.BookingDetails
                .AsNoTracking()
                .Where(bd => bd.Booking.Status == BookingStatus.Confirmed || bd.Booking.Status == BookingStatus.Completed)
                .GroupBy(bd => bd.RoomId)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .Take(top)
                .Join(_context.Rooms
                .Include(r => r.RoomImages)
                .Include(r => r.RoomAmenities)
                .ThenInclude(ra => ra.Amenity),
                roomId => roomId,
                room => room.Id,
                (roomId, room) => room

                ).ToListAsync();
        }

        public async Task<List<Booking>> GetBookingsInRangeAsync(DateTime start, DateTime end)
        {
            return await _context.Bookings
                .Include(b => b.BookingDetails)
                .Where(b =>
                    b.CheckInDate <= end && // Đổi < thành <=
                    b.CheckOutDate >= start && // Đổi > thành >=
                    (int)b.Status != 3 // Không lấy Cancel
                )
                .ToListAsync();
        }

    }
}
