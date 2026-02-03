export interface BookingDetail {
  roomId: number;
  pricePerNight: number;
}

export interface BookingRequest {
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  roomIds: number[];
}

export interface SearchRoomRequest {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

export enum BOOKING_STATUS {
  PENDING = 0,
  CONFIRM = 1,
  COMPLETE = 2,
  CANCEL = 3,
}

export interface BookingDetail {
  roomId: number;
  roomName: string;
  address: string;
  basePrice: number;
  pricePerNight: number;
}

export interface BookingResponse {
  id: number;
  userId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalDays: number;
  totalPrice: number;
  status: BOOKING_STATUS; // ✅ NUMBER
  bookingDetails: BookingDetail[];
}
// Alias for backward compatibility
export type BookingReponse = BookingResponse;
