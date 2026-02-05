import {
  BookingRequest,
  SearchRoomRequest,
  BookingResponse,
  BookingReponse,
} from "@/types/booking";
import { Room } from "@/types/room";
import api from "./axios";

export const BookingApi = {
  // Create a new booking
  createBooking: (data: BookingRequest) =>
    api.post<BookingResponse>("/api/booking", data),

  // Search available rooms
  searchRooms: (data: SearchRoomRequest) =>
    api.post<Room[]>("/api/booking/search-rooms", data),

  // Check room availability
  checkAvailability: (
    roomId: number,
    checkInDate: string,
    checkOutDate: string,
  ) =>
    api.get<{ available: boolean; message: string }>(
      `/api/booking/availability/${roomId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
    ),

  // Get user's bookings
  getMyBookings: () => api.get<BookingResponse[]>("/api/booking/my-bookings"),

  // Get booking by ID
  getBookingById: (bookingId: number) =>
    api.get<BookingResponse>(`/api/booking/my-bookings/${bookingId}`),

  // Cancel a booking
  cancelBooking: (bookingId: number) =>
    api.patch<{ message: string }>(`/api/booking/${bookingId}/cancel`),

  getAllBooking: () => api.get(`/api/admin/booking`),
  setConfirmBooking: (id: number) =>
    api.patch(`/api/admin/booking/${id}/confirm`),
  setCompleteBooking: (id: number) =>
    api.patch(`/api/admin/booking/${id}/complete`),
  setPendingBooking: (id: number) =>
    api.patch(`/api/admin/booking/${id}/pending`),
  setCancelBooking: (id: number) =>
    api.patch(`/api/admin/booking/${id}/cancel`),
  getBestSellingRoom: (top: number) => api.get(`/api/booking/bestselling`),
  getRoomMatrix: (start: string, end: string) =>
    api.get(`/api/admin/booking/matrix?start=${start}&end=${end}`),
};
