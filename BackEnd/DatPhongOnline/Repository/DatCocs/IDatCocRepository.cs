using DatPhongOnline.Data.Entities;

namespace DatPhongOnline.Repository.DatCocs
{

        public interface IDatCocRepository
        {
            Task TaoAsync(DatCoc datCoc);
            Task<DatCoc?> LayTheoMaHeThongAsync(string ma);
            Task LuuAsync();
        Task<DatCoc?> LayTheoBookingIdAsync(int bookingId);
    }

}
