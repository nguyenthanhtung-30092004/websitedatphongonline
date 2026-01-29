using DatPhongOnline.Data;
using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Booking;
using DatPhongOnline.Repository.Bookings;
using DatPhongOnline.Repository.Rooms;
using Microsoft.EntityFrameworkCore;

namespace DatPhongOnline.Services.BookingService
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _repo;
        private readonly IRoomRepository _roomRepo;

        public BookingService(IBookingRepository repo, IRoomRepository roomRepo)
        {
            _repo = repo;
            _roomRepo = roomRepo;
        }

        // admin
        public async Task<List<BookingDto>> GetAllBookAsync()
        {
            var bookings = await _repo.GetAllBookingListAsync();
            return bookings.Select(b => new BookingDto
            {
                Id = b.Id,
                UserId = b.UserId,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                Adults = b.Adults,
                Children = b.Children,
                TotalDays = b.TotalDays,
                TotalPrice = b.TotalPrice,
                Status = b.Status,
                BookingDetails = b.BookingDetails
    .Select(d => new BookingDetailDto
    {
        RoomId = d.RoomId,
        PricePerNight = d.PricePerNight
    })
    .ToList()

            }).ToList();
        }

        public async Task AdminUpdateStatusAsync(int id, BookingStatus status)
        {
            var booking = await _repo.GetBookingByIdAsync(id);
            if (booking == null)
                throw new Exception("Booking không tồn tại");

            booking.Status = status;
            await _repo.SaveChangeAsync();
        }

        //user

        public async Task<List<BookingDto>> GetUserBookingsAsync(int userId)
        {
            var bookings = await _repo.GetUserBookingsAsync(userId);
            return bookings.Select(b => new BookingDto
            {
                Id = b.Id,
                UserId = b.UserId,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                Adults = b.Adults,
                Children = b.Children,
                TotalDays = b.TotalDays,
                TotalPrice = b.TotalPrice,
                Status = b.Status,
                BookingDetails = b.BookingDetails
    .Select(d => new BookingDetailDto
    {
        RoomId = d.RoomId,
        PricePerNight = d.PricePerNight
    })
    .ToList()

            }).ToList();
        }

        public async Task<BookingDto?> GetBookingByIdAsync(int bookingId)
        {
            var booking = await _repo.GetBookingByIdAsync(bookingId);

            if (booking == null)
                return null;

            return new BookingDto
            {
                Id = booking.Id,
                UserId = booking.UserId,
                CheckInDate = booking.CheckInDate,
                CheckOutDate = booking.CheckOutDate,
                Adults = booking.Adults,
                Children = booking.Children,
                TotalDays = booking.TotalDays,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                BookingDetails = booking.BookingDetails
    .Select(d => new BookingDetailDto
    {
        RoomId = d.RoomId,
        PricePerNight = d.PricePerNight
    })
    .ToList()

            };
        }


        public async Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto dto)
        {
            if (dto.RoomIds == null || dto.RoomIds.Count == 0)
                throw new Exception("Phải chọn ít nhất một phòng");

            var totalDays = (dto.CheckOutDate - dto.CheckInDate).Days;
            if (totalDays <= 0)
                throw new Exception("Ngày check-out phải sau check-in");

            var bookingDetails = new List<BookingDetail>();
            decimal totalPrice = 0;

            foreach (var roomId in dto.RoomIds)
            {
                var room = await _roomRepo.GetByIdAsync(roomId);
                if (room == null)
                    throw new Exception($"Phòng {roomId} không tồn tại");

                var isAvailable = await _repo.IsRoomAvailableAsync(roomId, dto.CheckInDate, dto.CheckOutDate);
                if (!isAvailable)
                    throw new Exception($"Phòng {room.RoomName} không có sẵn trong khoảng ngày này");

                bookingDetails.Add(new BookingDetail
                {
                    RoomId = roomId,
                    PricePerNight = room.BasePrice
                });

                totalPrice += room.BasePrice * totalDays;
            }

            var booking = new Booking
            {
                UserId = userId,
                CheckInDate = dto.CheckInDate,
                CheckOutDate = dto.CheckOutDate,
                Adults = dto.Adults,
                Children = dto.Children,
                TotalDays = totalDays,
                TotalPrice = totalPrice,
                Status = BookingStatus.Pending,
                BookingDetails = bookingDetails
            };

            await _repo.AddBookingAsync(booking);
            await _repo.SaveChangeAsync();

            return new BookingDto
            {
                Id = booking.Id,
                UserId = booking.UserId,
                CheckInDate = booking.CheckInDate,
                CheckOutDate = booking.CheckOutDate,
                Adults = booking.Adults,
                Children = booking.Children,
                TotalDays = booking.TotalDays,
                Status = booking.Status,
                TotalPrice = booking.TotalPrice,
                BookingDetails = booking.BookingDetails
                    .Select(d => new BookingDetailDto
                    {
                        RoomId = d.RoomId,
                        PricePerNight = d.PricePerNight
                    })
                    .ToList()
            };

        }

        public async Task CancelBooking(int bookingId, int userId)
        {
            var booking = await _repo.GetBookingByIdAsync(bookingId);
            if (booking == null)
                throw new Exception("Booking không tồn tại");

            if (booking.UserId != userId)
                throw new Exception("Không có quyền hủy booking này");

            if (booking.Status == BookingStatus.Completed || booking.Status == BookingStatus.Canceled)
                throw new Exception("Không thể hủy booking đã hoàn tất hoặc đã hủy");

            booking.Status = BookingStatus.Canceled;
            await _repo.SaveChangeAsync();
        }
    }
}
