const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const app = express();

// ============= CẤU HÌNH =============
const PORT = process.env.PORT || 10000;
const GOOGLE_SHEETS_ID = "YOUR_GOOGLE_SHEETS_ID"; // Thay bằng ID sheet của bạn
const SHEET_NAME = "ĐăngKý"; // Tên của sheet muốn ghi dữ liệu

// ============= CẤU HÌNH EMAIL GMAIL =============
// BẠN CẦN: Tạo App Password từ Google Account
// 1. Bật 2-Step Verification trên tài khoản Google
// 2. Truy cập: myaccount.google.com/apppasswords
// 3. Tạo "App password" cho "Mail" và "Windows Computer"
// 4. Copy mật khẩu ứng dụng vào đây
const EMAIL_CONFIG = {
    service: "gmail",
    auth: {
        user: "bfcenter2023@gmail.com", // Email của bạn
        pass: "YOUR_APP_PASSWORD" // App Password (không phải mật khẩu Gmail)
    }
};

// ============= MIDDLEWARE =============
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./")));

// ============= HÀM GỬI EMAIL =============
async function sendEmailNotification(fullName, phone, course) {
    try {
        const transporter = nodemailer.createTransport(EMAIL_CONFIG);

        const emailContent = `
<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #d32f2f;">Thông báo đăng ký khóa học mới</h2>
        <p>Bạn có <strong>1 đơn đăng ký mới</strong> từ:</p>
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Họ và tên:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${fullName}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Số điện thoại:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${phone}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Khóa học:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${course}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Thời gian đăng ký:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${new Date().toLocaleString('vi-VN')}</td>
            </tr>
        </table>
        <p style="color: #666;">Vui lòng kiểm tra thông tin và liên hệ học viên sớm nhất.</p>
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">Email này được gửi tự động từ hệ thống đăng ký trực tuyến.</p>
    </body>
</html>
        `;

        const mailOptions = {
            from: EMAIL_CONFIG.auth.user,
            to: "bfcenter2023@gmail.com", // Email nhận thông báo
            subject: `Đơn đăng ký mới từ ${fullName}`,
            html: emailContent
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email thông báo đã gửi thành công");
        return true;
    } catch (error) {
        console.error("❌ Lỗi gửi email:", error.message);
        // Không dừng quy trình nếu email thất bại
        return false;
    }
}

// ============= HÀM GHI DỮ LIỆU VÀO GOOGLE SHEETS =============
async function appendToGoogleSheets(fullName, phone, course) {
    try {
        // Kiểm tra xem file credentials.json có tồn tại không
        const credentialsPath = path.join(__dirname, "credentials.json");
        if (!fs.existsSync(credentialsPath)) {
            throw new Error(
                "❌ Không tìm thấy credentials.json. Vui lòng làm theo hướng dẫn để tạo file này từ Google Cloud Console"
            );
        }

        const credentials = require(credentialsPath);

        // Xác thực Google API
        const auth = new google.auth.GoogleAuth({
            keyFile: credentialsPath,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"]
        });

        const sheets = google.sheets({ version: "v4", auth });

        // Dữ liệu sẽ được ghi: Thời gian, Họ tên, Số điện thoại, Khóa học
        const values = [
            [
                new Date().toLocaleString('vi-VN'),
                fullName,
                phone,
                course
            ]
        ];

        const request = {
            spreadsheetId: GOOGLE_SHEETS_ID,
            range: `${SHEET_NAME}!A:D`, // Ghi vào cột A-D
            valueInputOption: "USER_ENTERED",
            resource: {
                values: values
            }
        };

        const response = await sheets.spreadsheets.values.append(request);
        console.log("✅ Dữ liệu đã ghi vào Google Sheets:", response.data);
        return true;
    } catch (error) {
        console.error("❌ Lỗi ghi Google Sheets:", error.message);
        // Ghi log lỗi nhưng vẫn trả về thành công cho người dùng
        return false;
    }
}

// ============= API ĐĂNG KÝ =============
app.post("/api/register", async (req, res) => {
    try {
        const { fullName, phone, course } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!fullName || !phone || !course) {
            return res.status(400).json({
                success: false,
                message: "❌ Vui lòng nhập đầy đủ thông tin (Họ tên, Số điện thoại, Khóa học)."
            });
        }

        // Kiểm tra định dạng số điện thoại (10-11 chữ số)
        if (!/^\d{10,11}$/.test(phone.replace(/[^0-9]/g, ""))) {
            return res.status(400).json({
                success: false,
                message: "❌ Số điện thoại không hợp lệ."
            });
        }

        console.log("📋 Nhận yêu cầu đăng ký:", { fullName, phone, course });

        // Gửi email thông báo (không chặn nếu thất bại)
        await sendEmailNotification(fullName, phone, course);

        // Ghi dữ liệu vào Google Sheets (không chặn nếu thất bại)
        await appendToGoogleSheets(fullName, phone, course);

        // Trả về phản hồi thành công
        return res.status(200).json({
            success: true,
            message: "✅ Cảm ơn bạn! Thông tin đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất."
        });
    } catch (error) {
        console.error("❌ Lỗi API đăng ký:", error.message);
        return res.status(500).json({
            success: false,
            message: "❌ Có lỗi xảy ra. Vui lòng thử lại sau."
        });
    }
});

// ============= ROUTE MẶC ĐỊNH =============
// Trả file index.html cho tất cả đường dẫn khác
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ============= KHỞI ĐỘNG SERVER =============
app.listen(PORT, "0.0.0.0", () => {
    console.log(`
╔════════════════════════════════════════════╗
║  🎓 NGOẠI NGỮ PHƯƠNG THẢO - Backend        ║
║  📍 Server đang chạy tại port: ${PORT}    ║
║  🌐 Truy cập: http://localhost:${PORT}    ║
╚════════════════════════════════════════════╝

⚠️  HƯỚNG DẪN CẤU HÌNH:
1. CẤU HÌNH EMAIL GMAIL:
   - Mở https://myaccount.google.com/apppasswords
   - Bật 2-Step Verification nếu chưa bật
   - Tạo App Password cho "Mail"
   - Thay thế YOUR_APP_PASSWORD trong file này

2. CẤU HÌNH GOOGLE SHEETS:
   - Tải file credentials.json từ Google Cloud Console
   - Đặt file này cùng thư mục với server.js
   - Thay thế YOUR_GOOGLE_SHEETS_ID bằng ID sheet thực
   - Share quyền chỉnh sửa sheet cho email của Service Account

3. CÀI ĐẶT THƯ VIỆN:
   npm install express cors nodemailer googleapis
    `);
});