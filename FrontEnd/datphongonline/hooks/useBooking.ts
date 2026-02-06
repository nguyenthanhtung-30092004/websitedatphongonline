"use client";

import { useState } from "react";
import { message } from "antd";
import { bookingApi } from "@/services/api/booking.api";
import {
  BookingRequest,
  SearchRoomRequest,
  BookingResponse,
  BookingReponse,
} from "@/types/booking";
import { Room } from "@/types/room";

export function useBooking() {
  const [bookings, setBooking] = useState<BookingReponse[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bestSelling, setBestSelling] = useState<[]>([]);

  // Get all bookings for current user
  const getMyBooking = async () => {
    if (submitting) return;

    try {
      const res = await bookingApi.getMyBookings();
      return res.data;
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Lỗi lấy booking");
      throw err;
    }
  };

  // Get booking by ID
  const getBookingById = async (bookingId: number) => {
    try {
      const res = await bookingApi.getBookingById(bookingId);
      return res.data;
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Lỗi lấy chi tiết booking");
      throw err;
    }
  };

  // Create a new booking
  const createBooking = async (data: BookingRequest) => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const res = await bookingApi.createBooking(data);
      message.success("Đặt phòng thành công 🎉");
      return res.data;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "Lỗi đặt phòng";
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: number) => {
    try {
      await bookingApi.cancelBooking(bookingId);
      message.success("Hủy đặt phòng thành công");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Lỗi hủy đặt phòng");
      throw err;
    }
  };

  // Search available rooms
  const searchRooms = async (data: SearchRoomRequest) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await bookingApi.searchRooms(data);
      setRooms(res.data);
      message.success("Tìm phòng thành công");
      return res.data;
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Lỗi tìm phòng");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBooking = async (): Promise<BookingResponse[]> => {
    try {
      setLoading(true);
      const res = await bookingApi.getAllBooking();
      setBooking(res.data);
      return res.data;
    } catch (err) {
      message.error("Không tải được danh sách booking");
      return []; // ✅ CỰC KỲ QUAN TRỌNG
    } finally {
      setLoading(false);
    }
  };
  const setConfirmBooking = async (id: number) => {
    try {
      setLoading(true);
      const res = await bookingApi.setConfirmBooking(id);
      setBooking(res.data);
      return res.data;
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const setCompleteBooking = async (id: number) => {
    try {
      setLoading(true);
      const res = await bookingApi.setCompleteBooking(id);
      setBooking(res.data);
      return res.data;
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const setPendingBooking = async (id: number) => {
    try {
      setLoading(true);
      const res = await bookingApi.setPendingBooking(id);
      setBooking(res.data);
      return res.data;
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const setCancelBooking = async (id: number) => {
    try {
      setLoading(true);
      const res = await bookingApi.setCancelBooking(id);
      setBooking(res.data);
      return res.data;
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBestSellingBooking = async (top: number) => {
    try {
      setLoading(true);
      const res = await bookingApi.getBestSellingRoom(top);
      setBestSelling(res.data);
      return res.data;
    } catch (err) {
      message.error("Lấy các phòng được đặt nhiều nhất thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    rooms,
    loading,
    submitting,
    createBooking,
    searchRooms,
    getMyBooking,
    cancelBooking,
    getBookingById,
    fetchBooking,
    setCompleteBooking,
    setConfirmBooking,
    setPendingBooking,
    setCancelBooking,
    getBestSellingBooking,
  };
}
