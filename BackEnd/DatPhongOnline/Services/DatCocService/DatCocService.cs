using DatPhongOnline.Configurations;
using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Datcoc;
using DatPhongOnline.Repository.Bookings;
using DatPhongOnline.Repository.DatCocs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;

namespace DatPhongOnline.Services.DatCocService
{
    public class DatCocService : IDatCocService
    {
        private readonly IDatCocRepository _datCocRepo;
        private readonly IBookingRepository _bookingRepo;
        private readonly VnPaySettings _vnPay;

        public DatCocService(
            IDatCocRepository datCocRepo,
            IBookingRepository bookingRepo,
            IOptions<VnPaySettings> vnPay)
        {
            _datCocRepo = datCocRepo;
            _bookingRepo = bookingRepo;
            _vnPay = vnPay.Value;
        }


        public async Task<string> TaoDatCocAsync(int userId, TaoDatCocDto dto)
        {
            var booking = await _bookingRepo.GetBookingByIdAsync(dto.BookingId);
            if (booking == null || booking.UserId != userId)
                throw new Exception("Booking không hợp lệ");

            decimal soTienDatCoc = booking.TotalPrice * dto.PhanTramDatCoc / 100;
            string maHeThong = DateTime.UtcNow.Ticks.ToString();

            var datCoc = new DatCoc
            {
                BookingId = booking.Id,
                SoTienDatCoc = soTienDatCoc,
                TrangThai = TrangThaiDatCoc.ChoThanhToan,
                MaGiaoDichVNPay = maHeThong
            };

            await _datCocRepo.TaoAsync(datCoc);

 
            if (_vnPay.UseMock)
            {
                datCoc.TrangThai = TrangThaiDatCoc.DaThanhToan;
                datCoc.ThoiGianThanhToan = DateTime.UtcNow;
                booking.Status = BookingStatus.Confirmed;

                await _datCocRepo.LuuAsync();


                return "http://localhost:3000/checkout/success";
            }
            // ==============================================

            await _datCocRepo.LuuAsync();
            return TaoUrlVNPay(soTienDatCoc, maHeThong);
        }

        // =====================================================
        // TẠO URL VNPAY (CHỈ DÙNG KHI KHÔNG MOCK)
        // =====================================================
        private string TaoUrlVNPay(decimal soTien, string maGiaoDich)
        {
            var vnTime = DateTime.UtcNow.AddHours(7);

            var data = new SortedDictionary<string, string>
            {
                ["vnp_Version"] = _vnPay.Version,
                ["vnp_Command"] = _vnPay.Command,
                ["vnp_TmnCode"] = _vnPay.TmnCode,
                ["vnp_Amount"] = ((long)(soTien * 100)).ToString(),
                ["vnp_CurrCode"] = _vnPay.CurrCode,
                ["vnp_TxnRef"] = maGiaoDich,
                ["vnp_OrderInfo"] = "Dat coc booking",
                ["vnp_OrderType"] = "hotel",
                ["vnp_Locale"] = _vnPay.Locale,
                ["vnp_ReturnUrl"] = _vnPay.ReturnUrl,
                ["vnp_IpAddr"] = "127.0.0.1",
                ["vnp_CreateDate"] = vnTime.ToString("yyyyMMddHHmmss"),
                ["vnp_ExpireDate"] = vnTime.AddMinutes(15).ToString("yyyyMMddHHmmss")
            };

            string rawData = string.Join("&",
                data.Select(x => $"{x.Key}={x.Value}"));

            string secureHash = TaoChuKy(rawData);
            data.Add("vnp_SecureHash", secureHash);

            return QueryHelpers.AddQueryString(_vnPay.BaseUrl, data);
        }

        // =====================================================
        // XỬ LÝ KẾT QUẢ VNPAY (CHỈ DÙNG KHI LIVE)
        // =====================================================
        public async Task XuLyKetQuaVNPayAsync(IQueryCollection query)
        {
            var vnpParams = query
                .Where(x => x.Key.StartsWith("vnp_") && x.Key != "vnp_SecureHash")
                .OrderBy(x => x.Key)
                .ToDictionary(x => x.Key, x => x.Value.ToString());

            string rawData = string.Join("&",
                vnpParams.Select(x => $"{x.Key}={x.Value}"));

            string secureHash = TaoChuKy(rawData);
            string vnpSecureHash = query["vnp_SecureHash"];

            if (secureHash != vnpSecureHash)
                throw new Exception("Chữ ký VNPay không hợp lệ");

            string ma = query["vnp_TxnRef"];
            string responseCode = query["vnp_ResponseCode"];

            var datCoc = await _datCocRepo.LayTheoMaHeThongAsync(ma);
            if (datCoc == null) return;

            if (responseCode == "00")
            {
                datCoc.TrangThai = TrangThaiDatCoc.DaThanhToan;
                datCoc.ThoiGianThanhToan = DateTime.UtcNow;
                datCoc.Booking.Status = BookingStatus.Confirmed;
            }
            else
            {
                datCoc.TrangThai = TrangThaiDatCoc.ThatBai;
            }

            await _datCocRepo.LuuAsync();
        }
        private string TaoChuKy(string input)
        {
            using var hmac = new HMACSHA512(
                Encoding.UTF8.GetBytes(_vnPay.HashSecret));

            return BitConverter
                .ToString(hmac.ComputeHash(Encoding.UTF8.GetBytes(input)))
                .Replace("-", "")
                .ToLower();
        }

        public async Task<DatCoc?> LayDatCocTheoBookingAsync(int bookingId, int userId)
        {
            var datCoc = await _datCocRepo.LayTheoBookingIdAsync(bookingId);

            if (datCoc == null)
                return null;
            Console.WriteLine(userId);
            Console.WriteLine(datCoc.Booking.UserId);

            if (datCoc.Booking.UserId != userId)
                throw new Exception("Không có quyền truy cập giao dịch này");

            return datCoc;
        }


    }
}
