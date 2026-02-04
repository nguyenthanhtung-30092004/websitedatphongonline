using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Datcoc;

namespace DatPhongOnline.Services.DatCocService
{
    public interface IDatCocService
    {
        Task<string> TaoDatCocAsync(int userId, TaoDatCocDto dto);
        Task XuLyKetQuaVNPayAsync(IQueryCollection query);
        Task<DatCoc?> LayDatCocTheoBookingAsync(int bookingId, int userId);

    }
}
