export interface Room {
  id: number;
  roomName: string;
  address?: string;
  basePrice: number;
  roomTypeId: number;
  roomTypeName: string;
  imageUrls: string[];
  amenities: string[];
}
