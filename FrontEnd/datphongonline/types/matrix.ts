type StatusType = "Available" | "Occupied" | "Upcoming";

type DayStatus = {
  date: string;
  status: StatusType;
};

type RoomMatrix = {
  roomId: number;
  roomName: string;
  days: DayStatus[];
};
