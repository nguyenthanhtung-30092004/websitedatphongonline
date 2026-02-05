using DatPhongOnline.Data;
using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Booking;
using DatPhongOnline.Dtos.Room;
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
                        RoomName = d.Room.RoomName,
                        Address = d.Room.Address,
                        BasePrice = d.Room.BasePrice,
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
                        RoomName = d.Room.RoomName,
                        Address = d.Room.Address,
                        BasePrice = d.Room.BasePrice,
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
                        RoomName = d.Room.RoomName,
                        Address = d.Room.Address,
                        BasePrice = d.Room.BasePrice,
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

            int totalGuests = dto.Adults + dto.Children;
            if (totalGuests <= 0)
                throw new Exception("Phải có ít nhất một khách");

            var bookingDetails = new List<BookingDetail>();
            decimal totalPrice = 0;

            foreach (var roomId in dto.RoomIds)
            {
                var room = await _roomRepo.GetByIdAsync(roomId);
                if (room == null)
                    throw new Exception($"Phòng {roomId} không tồn tại");

                if (room.RoomType == null)
                    throw new Exception($"Loại phòng của phòng {room.RoomName} không được cấu hình");

                if (totalGuests > room.RoomType.MaxGuests)
                    throw new Exception($"Phòng {room.RoomName} chỉ chứa tối đa {room.RoomType.MaxGuests} khách, nhưng bạn có {totalGuests} khách");

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
                        RoomName = d.Room.RoomName,
                        Address = d.Room.Address,
                        BasePrice = d.Room.BasePrice,
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

            var now = DateTime.UtcNow; // hoặc Now nếu bạn dùng local
            var hoursSinceCreated = (now - booking.Createdat).TotalHours;

            if (hoursSinceCreated > 24)
                throw new Exception("Đã quá 24 giờ kể từ khi đặt, không thể hủy booking");

            booking.Status = BookingStatus.Canceled;
            await _repo.SaveChangeAsync();
        }
        public async Task<List<RoomDto>> SearchRoomsAsync(SearchRoomDto dto)
            {
                if (dto.CheckOut <= dto.CheckIn)
                    throw new Exception("Ngày checkout phải sau check-in");

                int totalGuest = dto.Adults + dto.Children;
                var rooms = await _repo.SearchAsync(
                    dto.CheckIn, dto.CheckOut, dto.Adults, dto.Children);
                return rooms.Select(r => new RoomDto
                {
                    Id = r.Id,
                    RoomName = r.RoomName,
                    Address = r.Address,
                    BasePrice = r.BasePrice,
                    RoomTypeId = r.RoomTypeId,
                    ImageUrls = r.RoomImages.Select(i => i.ImageUrl).ToList(),
                    Amenities = r.RoomAmenities.Select(a => a.Amenity.Name).ToList()
                }).ToList();
            }

        public async Task<List<RoomDto>> GetTopBookedRoomAsync(int top)
        {
            var rooms = await _repo.GetTopBookedRoomsAsync(top);
            return rooms.Select(r => new RoomDto
            {
                Id = r.Id,
                RoomName = r.RoomName,
                Address = r.Address,
                BasePrice = r.BasePrice,
                RoomTypeId = r.RoomTypeId,
                ImageUrls = r.RoomImages.Select(i => i.ImageUrl).ToList(),
                Amenities = r.RoomAmenities.Select(a => a.Amenity.Name).ToList()
            }).ToList();
        }

        public async Task<List<RoomMatrixDto>> GetRoomMatrixAsync(DateTime startDate, DateTime endDate)
        {
            // 1. Lấy danh sách phòng hiện có
            var rooms = await _roomRepo.GetAllAsync();

            // 2. Lấy booking từ Repository (Đã sửa logic lọc ngày ở trên)
            var bookings = await _repo.GetBookingsInRangeAsync(startDate, endDate);

            // 3. Lọc Occupancy: Chỉ lấy các booking "Đang giữ chỗ" (0 và 1)
            // Nếu bạn muốn Status 2 (Complete) cũng hiện màu đỏ thì thêm (int)b.Status == 2
            var roomOccupancy = bookings
                .Where(b => b.BookingDetails != null &&
                           ((int)b.Status == 0 || (int)b.Status == 1))
                .SelectMany(b => b.BookingDetails.Select(d => new
                {
                    d.RoomId,
                    CheckIn = b.CheckInDate.Date,
                    CheckOut = b.CheckOutDate.Date
                }))
                .ToLookup(x => x.RoomId);

            var result = new List<RoomMatrixDto>();

            foreach (var room in rooms)
            {
                var dto = new RoomMatrixDto
                {
                    RoomId = room.Id,
                    RoomName = room.RoomName,
                    Days = new List<RoomDayStatusDto>()
                };

                var occupancy = roomOccupancy[room.Id].ToList();

                for (var date = startDate.Date; date <= endDate.Date; date = date.AddDays(1))
                {
                    // Kiểm tra trạng thái Occupied (Bận)
                    // Khách ở từ Check-in đến TRƯỚC ngày Check-out
                    bool isOccupied = occupancy.Any(o => date >= o.CheckIn && date < o.CheckOut);

                    if (isOccupied)
                    {
                        dto.Days.Add(new RoomDayStatusDto
                        {
                            Date = DateOnly.FromDateTime(date),
                            Status = "Occupied"
                        });
                    }
                    else
                    {
                        // Kiểm tra trạng thái Upcoming (Sắp đến)
                        // Nếu ngày mai khách đúng ngày Check-in
                        bool isUpcoming = occupancy.Any(o => o.CheckIn == date.AddDays(1));

                        dto.Days.Add(new RoomDayStatusDto
                        {
                            Date = DateOnly.FromDateTime(date),
                            Status = isUpcoming ? "Upcoming" : "Available"
                        });
                    }
                }
                result.Add(dto);
            }

            return result;
        }

    }
}
