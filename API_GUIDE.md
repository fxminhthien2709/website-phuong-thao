# 📚 Hướng Dẫn Sử Dụng Hệ Thống Nâng Cấp

## 🎯 Tính Năng Mới

### 1️⃣ **Học Trực Tuyến - HỌC TRỰC TUYẾN** 
- Hiển thị 3 khóa học Tiếng Anh
- Khi click "Vào Học", mở Modal yêu cầu nhập **Mã Code Học Viên**
- Mã code hợp lệ: `HOCVIENVIP`, `CODE123`, `ENGLISH2024`, `PHUONGTHAO`
- Nếu đúng mã: Chuyển sang trang `study-room.html`
- Nếu sai mã: Hiển thị thông báo lỗi (màu đỏ)

### 2️⃣ **Phòng Tự Học - study-room.html**
- Giao diện học tập hiện đại với 2 cột:
  - **Cột trái**: Danh sách bài học (Accordion menu)
  - **Cột phải**: Khung video + Nội dung bài học
- 3 Unit với tổng cộng 8 bài học mẫu
- Tự động lưu tiến độ vào localStorage

### 3️⃣ **Tài Liệu Miễn Phí - TÀI LIỆU MIỄN PHÍ**
- Chuyển sang trang `documents.html`
- Hiển thị danh sách PDF dưới dạng grid
- Click để tải xuống tự động
- **KHÔNG CÓ** giao diện upload cho người dùng (chỉ backend)

### 4️⃣ **Các Tính Năng Cũ**
- ✅ "Khóa Học Của Tôi" → Thông báo chưa đăng ký
- ✅ "Hỗ Trợ Học Tập" → Modal với địa chỉ/hotline
- ✅ Xóa "Luyện Thi Online"

---

## 🔧 **Backend API - Upload & Quản Lý Tài Liệu**

### 📋 **Danh Sách API**

#### 1. **Upload PDF (Admin Only)**
```
POST /api/upload-document
Content-Type: multipart/form-data
Authorization: Bearer admin_secret_token_2024
```

**Request:**
```bash
curl -X POST http://localhost:10000/api/upload-document \
  -H "Authorization: Bearer admin_secret_token_2024" \
  -F "file=@/path/to/document.pdf"
```

**Response (Success):**
```json
{
  "success": true,
  "message": "✅ Tài liệu đã được upload thành công.",
  "file": {
    "filename": "1715000000000_tieu_de_tai_lieu.pdf",
    "originalName": "tiêu đề tài liệu.pdf",
    "size": 2048576,
    "uploadTime": "05/05/2026 10:30:45",
    "downloadUrl": "/documents/1715000000000_tieu_de_tai_lieu.pdf"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "❌ Chỉ cho phép upload file PDF"
}
```

---

#### 2. **Lấy Danh Sách Documents**
```
GET /api/documents
```

**Response:**
```json
{
  "success": true,
  "count": 6,
  "documents": [
    {
      "filename": "1715000000000_tieng_anh_co_ban.pdf",
      "downloadUrl": "/documents/1715000000000_tieng_anh_co_ban.pdf",
      "uploadTime": "2026-05-05T10:30:45.000Z"
    }
  ]
}
```

---

#### 3. **Download PDF**
```
GET /documents/{filename}
```

Trình duyệt sẽ tự động tải file xuống.

---

## 🚀 **Cách Sử Dụng**

### **Cài Đặt Multer**
```bash
npm install multer
```

### **Khởi Động Server**
```bash
npm start
```

### **Upload Tài Liệu (Sử dụng cURL)**
```bash
# Thay thế file.pdf bằng đường dẫn file thực tế
curl -X POST http://localhost:10000/api/upload-document \
  -H "Authorization: Bearer admin_secret_token_2024" \
  -F "file=@/path/to/file.pdf"
```

### **Upload Tài Liệu (Sử dụng Postman)**
1. URL: `http://localhost:10000/api/upload-document`
2. Method: `POST`
3. Headers: 
   - `Authorization: Bearer admin_secret_token_2024`
4. Body → Form-data:
   - Key: `file` (type: File)
   - Value: Chọn file PDF

### **Lấy Danh Sách Documents**
```bash
curl http://localhost:10000/api/documents
```

---

## 📂 **Cấu Trúc Thư Mục**

```
project/
├── learning.html          # ✅ Bảng điều khiển (cập nhật)
├── study-room.html        # ✅ Phòng tự học (mới)
├── documents.html         # ✅ Kho tài liệu (mới)
├── tailieu.html          # (cũ, có thể xóa)
├── server.js             # ✅ Backend (cập nhật)
├── package.json          # ✅ Dependencies (cập nhật)
├── documents/            # 📁 Thư mục chứa PDF (tự động tạo)
│   ├── 1715000000000_file1.pdf
│   ├── 1715000000001_file2.pdf
│   └── ...
└── ...
```

---

## 🔐 **Bảo Mật & Lưu Ý**

### **Admin Token**
- Hiện tại: `admin_secret_token_2024` (hardcoded)
- **Nên thay đổi** token này trong `server.js` để bảo mật
- **Trong thực tế**: Nên sử dụng JWT + Database

### **Upload Giới Hạn**
- Chỉ cho phép: **PDF** files
- Dung lượng tối đa: **50MB**
- Tên file được sanitize (xóa ký tự đặc biệt)

### **Xác Thực Học Viên**
- Mã code được lưu trong `localStorage` khi đăng nhập
- Có thể thêm kiểm tra mã code từ Database

---

## 📝 **Mã Code Mẫu Học Viên**

| Mã Code | Ghi Chú |
|---------|--------|
| `HOCVIENVIP` | Học viên VIP |
| `CODE123` | Mã thử nghiệm |
| `ENGLISH2024` | Khóa English 2024 |
| `PHUONGTHAO` | Trung tâm Phương Thảo |

**Cách thêm mã code mới:**
- Sửa array `validCodes` trong `learning.html`:
```javascript
const validCodes = ['HOCVIENVIP', 'CODE123', 'ENGLISH2024', 'PHUONGTHAO', 'CODE_MOI'];
```

---

## ✅ **Kiểm Tra Hệ Thống**

### **Test Learning Page**
1. Mở: `http://localhost:10000/learning.html`
2. Click "Vào Học" trên bất kỳ khóa học nào
3. Nhập mã code: `HOCVIENVIP`
4. Kiểm tra: Chuyển sang `study-room.html` ✓

### **Test Documents Page**
1. Mở: `http://localhost:10000/documents.html`
2. Kiểm tra: Danh sách tài liệu hiển thị ✓

### **Test Upload API**
```bash
# Upload file
curl -X POST http://localhost:10000/api/upload-document \
  -H "Authorization: Bearer admin_secret_token_2024" \
  -F "file=@path/to/file.pdf"

# Kiểm tra danh sách
curl http://localhost:10000/api/documents
```

---

## 🐛 **Troubleshooting**

### **Lỗi: "Module not found: multer"**
```bash
npm install multer
```

### **Lỗi: "Cannot create directory documents"**
- Server sẽ tự động tạo nếu chưa tồn tại
- Nếu vẫn lỗi, check quyền folder

### **Lỗi: "Only PDF files allowed"**
- Đảm bảo file có đuôi `.pdf`
- MIME type phải là `application/pdf`

### **Lỗi: "Unauthorized - Invalid token"**
- Check header: `Authorization: Bearer admin_secret_token_2024`
- Không có khoảng trắng thừa

---

## 🎨 **Giao Diện**

- ✅ Menu sidebar: Tên mục cập nhật
- ✅ Modal code login: Hiệu ứng mượt, responsive
- ✅ Study-room: Layout 2 cột, accordion menu
- ✅ Documents: Grid layout, tải xuống dễ dàng
- ✅ Tone màu: Đỏ (#d32f2f) + Xanh (#002e5b)
- ✅ Typography: Montserrat (tiêu đề) + Roboto (nội dung)

---

## 📞 **Hỗ Trợ**

Nếu gặp vấn đề, kiểm tra:
1. ✅ Server đang chạy: `npm start`
2. ✅ Port 10000 đang mở
3. ✅ Multer đã cài đặt
4. ✅ Thư mục `documents` có quyền ghi
5. ✅ Check console server cho error logs

---

**Cập nhật: 05/05/2026**
**Phiên bản: 2.0**
