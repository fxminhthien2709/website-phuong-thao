# 📋 HƯỚNG DẪN CẤU HÌNH BACKEND

## 📌 BƯỚC 1: CẤP NHật package.json - Cài Đặt Thư Viện

Bạn cần cài đặt các thư viện bổ sung cho Node.js:

```bash
npm install nodemailer googleapis
```

Hoặc nếu bạn chưa có package.json, hãy tạo file `package.json` như sau:

```json
{
  "name": "ngoai-ngu-phuong-thao",
  "version": "1.0.0",
  "description": "Website Ngoại Ngữ Phương Thảo",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "nodemailer": "^6.9.7",
    "googleapis": "^118.0.0"
  }
}
```

Sau đó chạy lệnh:
```bash
npm install
```

---

## 🔧 BƯỚC 2: CẤU HÌNH EMAIL GMAIL (Gửi Email Thông Báo)

### Lý do cần làm:
- Server sẽ gửi email thông báo về địa chỉ **bfcenter2023@gmail.com** khi có người đăng ký

### Các Bước Thực Hiện:

#### 2.1 Bật Xác Minh Hai Bước (2-Step Verification)
1. Truy cập: **https://myaccount.google.com/security**
2. Cuộn xuống tìm **"2-Step Verification"**
3. Click **"2-Step Verification"** → **Get Started**
4. Làm theo hướng dẫn (dùng điện thoại để xác minh)

#### 2.2 Tạo App Password
1. Truy cập: **https://myaccount.google.com/apppasswords**
2. Chọn **App**: **Mail** (Thư)
3. Chọn **Device**: **Windows Computer** (hoặc theo thiết bị của bạn)
4. Click **Generate**
5. Google sẽ cung cấp mật khẩu 16 ký tự (ví dụ: `abcd efgh ijkl mnop`)
6. **Copy** mật khẩu này

#### 2.3 Cập Nhật server.js
Mở file **server.js** và tìm dòng:
```javascript
const EMAIL_CONFIG = {
    service: "gmail",
    auth: {
        user: "bfcenter2023@gmail.com",
        pass: "YOUR_APP_PASSWORD" // ← Thay thế đây
    }
};
```

Thay `YOUR_APP_PASSWORD` bằng mật khẩu 16 ký tự (bỏ dấu cách):
```javascript
const EMAIL_CONFIG = {
    service: "gmail",
    auth: {
        user: "bfcenter2023@gmail.com",
        pass: "abcdefghijklmnop" // Ví dụ (không có dấu cách)
    }
};
```

---

## 🔐 BƯỚC 3: CẤU HÌNH GOOGLE SHEETS (Ghi Dữ Liệu Đăng Ký)

### Lý do cần làm:
- Dữ liệu đăng ký (Thời gian, Họ tên, Số điện thoại, Khóa học) sẽ được ghi tự động vào Google Sheet

### 3.1 Tạo Google Cloud Project

1. Truy cập: **https://console.cloud.google.com**
2. Click **Select a Project** (ở góc trên cùng) → **NEW PROJECT**
3. Đặt tên: **"Ngoai Ngu Phuong Thao"** → **CREATE**
4. Đợi project được tạo (~30 giây)

### 3.2 Bật Google Sheets API

1. Tìm kiếm **"Google Sheets API"** trong thanh tìm kiếm
2. Click vào **Google Sheets API**
3. Click **ENABLE**
4. Đợi vài giây để API được kích hoạt

### 3.3 Tạo Service Account

1. Truy cập: **https://console.cloud.google.com/iam-admin/serviceaccounts**
2. Click **CREATE SERVICE ACCOUNT**
3. Điền:
   - **Service account name**: `sheets-api-user`
   - Click **CREATE AND CONTINUE**
4. **Skip** các bước tiếp theo (không bắt buộc)
5. Click **CREATE**

### 3.4 Tạo Khóa JSON

1. Ở danh sách Service Accounts, click vào service account vừa tạo
2. Click tab **KEYS**
3. Click **ADD KEY** → **Create new key**
4. Chọn **JSON** → **CREATE**
5. File JSON sẽ **tự động tải về**
6. **Đổi tên file** thành `credentials.json` (xóa tên dài ngoài)
7. **Đặt file vào cùng thư mục với `server.js`**

### 3.5 Tạo Google Sheet

1. Truy cập: **https://sheets.google.com**
2. Click **"+"** để tạo sheet mới
3. Đặt tên: **"Ngoại Ngữ Phương Thảo"** (hoặc tên bạn thích)
4. Tạo tiêu đề các cột (Row 1):
   - **A1**: `Thời gian`
   - **B1**: `Họ tên`
   - **C1**: `Số điện thoại`
   - **D1**: `Khóa học`
5. Lưu sheet

### 3.6 Chia Sẻ Quyền Chỉnh Sửa

1. Click nút **Share** (góc phải)
2. Copy email từ file `credentials.json` (vào file > tìm `"client_email"`)
   - Ví dụ: `sheets-api-user@abc.iam.gserviceaccount.com`
3. Dán email vào ô **Add people and groups**
4. Chọn quyền **Editor** (Chỉnh sửa)
5. **Uncheck** "Notify people" (không cần thông báo)
6. Click **Share**

### 3.7 Cập Nhật server.js

Mở file **server.js** tìm dòng:
```javascript
const GOOGLE_SHEETS_ID = "YOUR_GOOGLE_SHEETS_ID";
```

Thay bằng ID thực:
1. Mở Google Sheet của bạn
2. Copy ID từ URL: `https://docs.google.com/spreadsheets/d/**ABC123XYZ**/edit`
3. Dán vào code:
```javascript
const GOOGLE_SHEETS_ID = "ABC123XYZ";
```

---

## ✅ BƯỚC 4: Kiểm Tra Cài Đặt

### Chạy Server Thử

```bash
node server.js
```

Bạn sẽ thấy:
```
╔════════════════════════════════════════════╗
║  🎓 NGOẠI NGỮ PHƯƠNG THẢO - Backend        ║
║  📍 Server đang chạy tại port: 10000      ║
║  🌐 Truy cập: http://localhost:10000     ║
╚════════════════════════════════════════════╝
```

### Test Form Đăng Ký
1. Mở **http://localhost:10000**
2. Cuộn xuống **form đăng ký**
3. Nhập thông tin và click **GỬI THÔNG TIN**
4. Kiểm tra:
   - Có nhận email thông báo không?
   - Dữ liệu có xuất hiện trong Google Sheet không?

---

## 🐛 Troubleshooting (Nếu Có Lỗi)

### ❌ Lỗi: "credentials.json not found"
- **Giải pháp**: Kiểm tra file `credentials.json` có trong cùng thư mục với `server.js` không

### ❌ Lỗi: "Invalid email or password"
- **Giải pháp**: 
  - Kiểm tra email `bfcenter2023@gmail.com` có bật 2-Step Verification?
  - Mật khẩu App có đúng không? (phải là App Password, không phải mật khẩu Gmail)

### ❌ Lỗi: "Permission denied" khi ghi Google Sheets
- **Giải pháp**:
  - Kiểm tra email Service Account có được chia sẻ quyền chỉnh sửa Sheet không?
  - Sheet ID có chính xác không?

### ❌ Form gửi không có phản hồi
- **Giải pháp**:
  - Kiểm tra Network tab (F12 → Network) có error gì không?
  - Server có chạy không?
  - Kiểm tra console log của server

---

## 📞 Thông Tin Liên Hệ

- **Nếu có lỗi** khi cài đặt, kiểm tra:
  1. File `credentials.json` tồn tại chưa?
  2. Google Sheet ID có đúng không?
  3. Email gmail có bật 2-Step Verification?
  4. Service Account có quyền chỉnh sửa Sheet?

---

## 🎯 Quy Trình Làm Việc

Khi người dùng điền form và nhấn **GỬI**:

1. **Frontend** → Gửi dữ liệu POST tới `/api/register`
2. **Backend nhận** → Kiểm tra dữ liệu
3. **Gửi email** → Thông báo tới `bfcenter2023@gmail.com`
4. **Ghi Google Sheets** → Lưu dữ liệu vào sheet
5. **Trả phản hồi** → Hiển thị thông báo thành công cho người dùng

---

## 📝 Ghi Chú

- Code đã có xử lý lỗi (error handling) đầy đủ
- Nếu email hoặc Google Sheets thất bại, form vẫn gửi thành công và hiển thị thông báo cho người dùng
- Nút submit sẽ disable khi đang gửi, tránh gửi lặp lại
