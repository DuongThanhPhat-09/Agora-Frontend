# Trang Tin Nhắn (Messages Page) - Tutor Workspace

## Tổng quan

Trang Tin nhắn cho phép gia sư quản lý các cuộc trò chuyện với phụ huynh, xem và xử lý các lời mời dạy (job offers).

## Cấu trúc

```
src/pages/TutorMessages/
├── MessagesPage.tsx      # Component chính
└── index.ts             # Export component
```

## Tính năng chính

### 1. Conversation List (Danh sách hội thoại)
- **Filter Tabs**: Lọc tin nhắn theo "Tất cả", "Chưa đọc", "Job Offers"
- **Search**: Tìm kiếm theo tên phụ huynh
- **Conversation Items**: Hiển thị avatar, tên, tin nhắn preview, thời gian
- **Status Indicators**: Badge "OFFER" cho lời mời dạy, dot đỏ cho tin chưa đọc
- **Active State**: Highlight conversation đang được chọn

### 2. Chat Window (Cửa sổ chat)
- **Chat Header**: Hiển thị thông tin người chat, trạng thái online/offline
- **Action Buttons**: Gọi điện, video call, thông tin, menu
- **Messages Area**: Khu vực hiển thị tin nhắn với scroll
- **Message Bubbles**: Các bubble tin nhắn với timestamp
- **Quick Replies**: Các câu trả lời nhanh

### 3. Job Offer Card (Thẻ lời mời dạy)
Hiển thị chi tiết lời mời gồm:
- Môn học (với icon và color coding)
- Tên học sinh
- Lịch học (ngày và giờ)
- Mức lương (được highlight đặc biệt)
- Hai nút action: "Chấp nhận ngay" và "Thương lượng / Từ chối"

### 4. Message Input
- Quick reply buttons
- Text input với emoji button
- Send button

## CSS Structure

File CSS tuân theo chuẩn của dự án:

```css
/* Location: src/styles/pages/tutor-messages.css */

/* 1. Import variables */
@import '../base/variables.css';

/* 2. Main layout */
.tutor-messages-dashboard { }

/* 3. Conversation list styles */
.conversation-list { }
.conversation-item { }

/* 4. Chat window styles */
.chat-window { }
.message-bubble { }

/* 5. Job offer card styles */
.job-offer-card { }

/* 6. Message input styles */
.message-input-container { }

/* 7. Responsive styles */
@media queries { }
```

## Component Props

Hiện tại component không nhận props, nhưng có thể mở rộng:

```typescript
interface MessagesPageProps {
  userId?: string;           // ID của tutor
  conversationId?: string;   // ID hội thoại được chọn
  onAcceptOffer?: (offerId: string) => void;
  onRejectOffer?: (offerId: string) => void;
}
```

## Routing

```typescript
// Trong App.tsx
<Route path="/tutor-messages" element={<MessagesPage />} />
```

## Color Coding

### Conversation Badges
- **Job Offer**: Gold gradient (#d4b483) - Lời mời dạy
- **Unread**: Red dot (#ef4444) - Tin chưa đọc
- **Active**: Light blue (#e0f2fe) - Hội thoại đang chọn

### Job Offer Details Icons
- **Subject**: Blue (#dbeafe, #3b82f6) - Môn học
- **Student**: Gray (#faf5ee, #6b7280) - Học sinh
- **Schedule**: Gray (#faf5ee, #6b7280) - Lịch học
- **Salary**: Green (#d1fae5, #10b981) - Mức lương

## Responsive Design

- **Desktop (>1200px)**: Full layout với sidebar, conversation list, và chat window
- **Tablet (992px-1200px)**: Thu nhỏ conversation list
- **Mobile (<992px)**: Stack conversation list trên chat window
- **Small Mobile (<480px)**: Vertical layout cho tất cả elements

## Future Enhancements

1. **Real-time messaging**: Tích hợp WebSocket hoặc Firebase
2. **File uploads**: Cho phép gửi ảnh, tài liệu
3. **Emoji picker**: Thêm emoji picker đầy đủ
4. **Read receipts**: Hiển thị tin đã đọc/chưa đọc
5. **Typing indicators**: Hiển thị khi người khác đang gõ
6. **Message search**: Tìm kiếm trong tin nhắn
7. **Archive conversations**: Lưu trữ hội thoại cũ
8. **Notification sounds**: Âm thanh thông báo tin mới

## Design Notes

- Tuân theo design system của AGORA (IBM Plex Serif, Bricolage Grotesque)
- Sử dụng color palette đã định nghĩa trong variables.css
- Border radius: 18px-20px cho consistency
- Box shadows: Subtle shadows cho depth
- Transitions: 0.2s ease cho smooth interactions

## Testing Checklist

- [ ] Navigation giữa các hội thoại
- [ ] Filter tabs hoạt động
- [ ] Search hoạt động
- [ ] Gửi tin nhắn
- [ ] Quick replies
- [ ] Accept/reject job offers
- [ ] Responsive trên các màn hình khác nhau
- [ ] Scroll trong conversation list
- [ ] Scroll trong messages area
