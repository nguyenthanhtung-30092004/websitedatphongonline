// Color Theme Configuration
export const colors = {
  // Primary colors - Vibrant & Fresh
  primary: "#FF6B35", // Vibrant Orange
  primaryLight: "#FFB347", // Light Orange
  primaryDark: "#D84315", // Dark Orange

  // Secondary colors - Complementary
  secondary: "#004E89", // Deep Blue
  secondaryLight: "#0077BE", // Bright Blue
  secondaryDark: "#003D5C", // Dark Blue

  // Accent colors
  accent: "#F7B801", // Golden Yellow
  accentLight: "#FFC107", // Light Yellow

  // Status colors
  success: "#52C41A", // Green
  successLight: "#95DE64", // Light Green
  warning: "#FAAD14", // Amber
  warningLight: "#FFD666", // Light Amber
  error: "#F5222D", // Red
  errorLight: "#FF7875", // Light Red
  info: "#1890FF", // Blue Info
  infoLight: "#69C0FF", // Light Blue Info

  // Neutral colors
  white: "#FFFFFF",
  background: "#F5F7FA", // Soft Background
  backgroundLight: "#FAFBFC", // Very Light Background
  border: "#E8E8E8", // Light Border
  borderDark: "#D9D9D9", // Darker Border
  text: "#1F2937", // Dark Text
  textSecondary: "#6B7280", // Gray Text
  textLight: "#9CA3AF", // Light Text

  // Specific for booking
  pending: "#FAAD14", // Amber
  pendingBg: "#FFFBE6", // Light Amber
  confirmed: "#1890FF", // Blue
  confirmedBg: "#E6F7FF", // Light Blue
  completed: "#52C41A", // Green
  completedBg: "#F6FFED", // Light Green
  canceled: "#FF4D4F", // Red
  canceledBg: "#FFF1F0", // Light Red
};

// Status badge styles
export const statusStyles = {
  Pending: {
    label: "Đang chờ",
    color: colors.pending,
    backgroundColor: colors.pendingBg,
    textClass: "text-amber-600 bg-amber-50",
  },
  Confirmed: {
    label: "Đã xác nhận",
    color: colors.confirmed,
    backgroundColor: colors.confirmedBg,
    textClass: "text-blue-600 bg-blue-50",
  },
  Completed: {
    label: "Hoàn thành",
    color: colors.completed,
    backgroundColor: colors.completedBg,
    textClass: "text-green-600 bg-green-50",
  },
  Canceled: {
    label: "Đã hủy",
    color: colors.canceled,
    backgroundColor: colors.canceledBg,
    textClass: "text-red-600 bg-red-50",
  },
};
