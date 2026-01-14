# Discord Debt Management Bot

Bot quản lý nợ cho Discord server với slash commands và tự động nhận diện từ chat.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env`:
```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
```

## Lấy Bot Token và Client ID

1. Truy cập [Discord Developer Portal](https://discord.com/developers/applications)
2. Tạo ứng dụng mới hoặc chọn ứng dụng hiện có
3. Vào tab "Bot" → Copy **Bot Token** → Thêm vào `.env` với key `DISCORD_BOT_TOKEN`
4. Vào tab "General Information" → Copy **Application ID** → Thêm vào `.env` với key `DISCORD_CLIENT_ID`
5. Vào tab "Bot" → Bật các quyền:
   - Message Content Intent
   - Server Members Intent (nếu cần)
6. Vào tab "OAuth2" → URL Generator:
   - Chọn scopes: `bot`, `applications.commands`
   - Chọn permissions: `Send Messages`, `Manage Threads`, `Read Message History`
   - Copy URL và mời bot vào server

## Chạy Bot

```bash
npm start
```

Hoặc chạy ở chế độ development với auto-reload:
```bash
npm run dev
```

## Slash Commands

### `/debt [user]`
Xem nợ của một người (để trống để xem nợ của bạn)

### `/add-debt <user> <amount>`
Thêm nợ cho người khác
- Ví dụ: `/add-debt @user 50k`

### `/pay [user] [amount]`
Thanh toán nợ
- Để trống `amount` để trả hết
- Ví dụ: `/pay @user 50k`

### `/clear-debt [user]`
Xóa toàn bộ nợ (để trống để xóa nợ của bạn)

### `/list-debts`
Liệt kê tất cả nợ trong hệ thống

### `/help`
Hiển thị hướng dẫn sử dụng bot

## Cách sử dụng tự động (Chat)

Bot cũng tự động nhận diện từ chat bình thường:

- `anh @user 50k` → Tự động thêm nợ
- `đã trả 50k @user` → Thanh toán nợ một phần
- `đã trả hết @user` → Thanh toán hết nợ

## Lưu ý

- Bot chỉ hoạt động trong channel `đại-gia-bđs`
- Tất cả thông báo được gửi vào thread "Debit"
- Dữ liệu nợ được lưu trong `data/debts.json`
