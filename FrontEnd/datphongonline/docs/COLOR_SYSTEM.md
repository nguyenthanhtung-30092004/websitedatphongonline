# Color System & Theme Configuration

## Overview

Hệ thống màu sắc được quản lý tập trung trong file `constants/colors.ts` để đảm bảo consistency và dễ bảo trì.

## Files

### 1. `constants/colors.ts`

File chính chứa tất cả định nghĩa màu sắc:

```typescript
import { colors, statusStyles } from "@/constants/colors";
```

**Colors Object:**

- `primary` - Màu chính (#FF6B35 - Vibrant Orange)
- `secondary` - Màu phụ (#004E89 - Deep Blue)
- `success`, `warning`, `error`, `info` - Các màu trạng thái
- `text`, `textSecondary`, `textLight` - Màu text
- `background`, `border` - Màu nền và border

**Status Styles Object:**

- `Pending` - Amber/Vàng cam
- `Confirmed` - Blue/Xanh dương
- `Completed` - Green/Xanh lá
- `Canceled` - Red/Đỏ

Mỗi status style có:

- `label` - Text hiển thị
- `color` - Màu chữ
- `backgroundColor` - Màu nền
- `textClass` - Tailwind class (dùng cho các trường hợp khác)

### 2. `app/globals.css`

File global styles áp dụng CSS variables cho:

- Ant Design components
- Input fields
- Button states
- Alert messages

## Usage Examples

### In Components

```typescript
import { colors } from "@/constants/colors";

export default function MyComponent() {
  return (
    <div style={{ backgroundColor: colors.background }}>
      <h1 style={{ color: colors.text }}>Title</h1>
      <button style={{ backgroundColor: colors.primary }}>
        Click me
      </button>
    </div>
  );
}
```

### For Status Badges

```typescript
import { statusStyles } from "@/constants/colors";

const status = "Pending";
const statusStyle = statusStyles[status as keyof typeof statusStyles];

<span
  className={`px-3 py-1 rounded-full ${statusStyle.textClass}`}
  style={{
    backgroundColor: statusStyle.backgroundColor,
    color: statusStyle.color,
  }}
>
  {statusStyle.label}
</span>
```

## Color Palette

| Name          | Hex     | Usage                     |
| ------------- | ------- | ------------------------- |
| Primary       | #FF6B35 | Main buttons, highlights  |
| Secondary     | #004E89 | Alternative actions       |
| Success       | #52C41A | Success states, completed |
| Warning       | #FAAD14 | Pending, caution          |
| Error         | #F5222D | Errors, cancellation      |
| Info          | #1890FF | Information, confirmed    |
| Background    | #F5F7FA | Page backgrounds          |
| Text          | #1F2937 | Primary text              |
| TextSecondary | #6B7280 | Secondary text            |
| Border        | #E8E8E8 | Borders, dividers         |

## Benefits

✅ **Consistency** - Tất cả components dùng cùng một bộ màu
✅ **Easy Maintenance** - Chỉ cần sửa 1 file để thay đổi toàn bộ màu sắc
✅ **Type Safety** - TypeScript autocomplete cho tất cả colors
✅ **Scalability** - Dễ thêm màu mới hoặc status mới
✅ **Ant Design Integration** - CSS variables tự động áp dụng

## Adding New Colors

1. Thêm vào `colors` object trong `constants/colors.ts`:

```typescript
export const colors = {
  // ... existing colors
  newColor: "#XXXXXX",
};
```

2. Nếu cần CSS variable, thêm vào `app/globals.css`:

```css
:root {
  --color-new-color: #XXXXXX;
}
```

3. Sử dụng ở component:

```typescript
style={{ backgroundColor: colors.newColor }}
```

## Current Implementation

- ✅ `app/(user)/checkout/page.tsx` - Using colors config
- ✅ `app/(user)/my-bookings/page.tsx` - Using colors & statusStyles
- ✅ `app/globals.css` - Global color variables
- ✅ `constants/colors.ts` - Centralized color definitions
