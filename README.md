# 🎓 NGOẠI NGỮ PHƯƠNG THẢO - Website

Hệ thống giáo dục Ngoại Ngữ & Tin Học chất lượng tại Bàu Bàng.

**Slogan**: Little Steps - Big Futures

---

## 📁 Cấu Trúc Dự Án

```
WEBSITE NGOAI NGU PHUONG THAO/
├── index.html              # Trang chủ
├── style.css               # CSS (responsive mobile-first)
├── script.js               # JavaScript (form, menu, animation)
├── server.js               # Backend Node.js (API đăng ký, email, Google Sheets)
├── package.json            # Dependencies
├── credentials.json        # Tệp xác thực Google (TẠO TỪ GOOGLE CLOUD)
├── HUONG_DAN_CAI_DAT.md   # Hướng dẫn chi tiết cài đặt
├── README.md               # File này
└── .env.example            # Ví dụ biến cấu hình
```

---

## 🚀 KHỞI ĐỘNG NHANH

### 1. Cài Đặt Thư Viện
```bash
npm install
```

### 2. Cấu Hình Cần Thiết
- **Gmail App Password**: https://myaccount.google.com/apppasswords
- **Google Sheets API credentials**: https://console.cloud.google.com
- Xem chi tiết ở file `HUONG_DAN_CAI_DAT.md`

### 3. Chạy Server
```bash
npm start
```

Truy cập: **http://localhost:10000**

---

## ✨ TÍNH NĂNG

### Frontend
✅ Giao diện responsive (Mobile-First)
✅ Menu hamburger cho mobile
✅ Animation scroll reveal
✅ Form đăng ký với validation
✅ Tab khóa học (Tiếng Anh, Tiếng Trung, Tin Học)
✅ FAQ accordion
✅ Nút floating action (Zalo, Hotline)

### Backend
✅ API `/api/register` - Nhận dữ liệu đăng ký
✅ Gửi email thông báo via Gmail
✅ Ghi dữ liệu vào Google Sheets tự động
✅ Error handling đầy đủ
✅ CORS enabled

---

## 📋 API ENDPOINTS

### POST /api/register
Nhận và xử lý dữ liệu đăng ký

**Request Body:**
```json
{
  "fullName": "Tên Học Viên",
  "phone": "0123456789",
  "course": "Khóa Tiếng Anh Bồi Dưỡng"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "✅ Cảm ơn bạn! Thông tin đã được gửi thành công..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "❌ Vui lòng nhập đầy đủ thông tin..."
}
```

---

## 🔐 Bảo Mật

- ✅ Xác thực qua Google Service Account (Google Sheets)
- ✅ Email gửi qua Gmail App Password (không dùng mật khẩu chính)
- ✅ Validation dữ liệu input
- ✅ CORS giới hạn (tùy chỉnh khi triển khai production)

---

## 🐛 Debugging

### Kiểm tra logs
```bash
# Server logs trong terminal
node server.js
```

### Kiểm tra Network
- Bật DevTools (F12 → Network tab)
- Gửi form → Xem request/response

### Common Issues
| Lỗi | Giải pháp |
|-----|----------|
| credentials.json not found | Đặt file credentials.json cùng thư mục server.js |
| Invalid App Password | Kiểm tra Gmail có bật 2-Step Verification? |
| Permission denied (Sheets) | Share Google Sheet cho Service Account email |

---

## 📞 Thông Tin Liên Hệ

**Ngoại Ngữ Phương Thảo**
- 📍 Cơ sở 1: D6-5A Đồng Sổ, Bàu Bàng
- 📍 Cơ sở 2: Long Bình, Long Nguyên
- 📞 Hotline: 0866 682 589
- 📧 Email: bfcenter2023@gmail.com

---

## 📄 License

ISC

---

## 🎯 Roadmap

- [ ] Admin dashboard để quản lý đơn đăng ký
- [ ] Payment integration
- [ ] Trực tuyến booking
- [ ] Video khóa học
- [ ] Hệ thống chat support

---

**Tạo bởi Ngoại Ngữ Phương Thảo © 2026**
