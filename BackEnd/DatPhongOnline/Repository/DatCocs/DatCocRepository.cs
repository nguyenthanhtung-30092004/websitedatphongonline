using DatPhongOnline.Data;
using DatPhongOnline.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatPhongOnline.Repository.DatCocs
{
    public class DatCocRepository : IDatCocRepository
    {
        private readonly AppDbContext _context;

        public DatCocRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task TaoAsync(DatCoc datCoc)
        {
            await _context.DatCocs.AddAsync(datCoc);
        }

        public async Task<DatCoc?> LayTheoMaHeThongAsync(string ma)
        {
            return await _context.DatCocs
                .Include(x => x.Booking)
                .FirstOrDefaultAsync(x => x.MaGiaoDichVNPay == ma);
        }

        public async Task LuuAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<DatCoc?> LayTheoBookingIdAsync(int bookingId)
        {
            return await _context.DatCocs
                .Include(x => x.Booking)
                .Where(x => x.BookingId == bookingId)
                .OrderByDescending(x => x.Id) // lấy giao dịch mới nhất
                .FirstOrDefaultAsync();
        }
    }
}
